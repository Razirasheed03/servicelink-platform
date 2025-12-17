import { IAuthService } from "../interfaces/auth.service.interface";
import bcrypt from "bcryptjs";
import redisClient from "../../config/redisClient";
import { randomInt } from "crypto";
import { sendOtpEmail } from "../../utils/sendEmail";
import type { SignupInput } from "../../validation/userSchemas";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import crypto from "crypto";
import { sendResetPasswordLink } from "../../utils/sendResetPasswordLink";
import { IUserRepository } from "../../repositories/interface/user.repository.interface";
import { IUserModel } from "../../models/interfaces/user.model.interface";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client({ clientId: process.env.GOOGLE_CLIENT_ID! });

export class AuthService implements IAuthService {
  constructor(private _userRepo: IUserRepository) {}

  signup = async (user: Omit<SignupInput, "confirmPassword">) => {
    const existing = await this._userRepo.findByEmail(user.email);
    if (existing) throw new Error("User already exists");

    const otp = randomInt(100000, 999999).toString();
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const key = `signup:${user.email}`;
    const createdAt = Date.now();

    const userData = {
      username: user.name,     
      email: user.email,
      phone: user.phone,
      password: hashedPassword,
      role: user.role,
      serviceType: user.serviceType || null,
      isBlocked: false,
    };

    await redisClient.setEx(
      key,
      300,
      JSON.stringify({
        ...userData,
        otp,
        createdAt,
      })
    );

    await sendOtpEmail(user.email, otp);
    console.log('otp send',otp);
    return { success: true, message: "OTP sent to email" };
  };

  verifyOtp = async (
    email: string,
    otp: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserModel;
  }> => {
    const key = `signup:${email}`;
    const redisData = await redisClient.get(key);
    if (!redisData) throw new Error("OTP expired or not found");
    const parsed = JSON.parse(redisData);
    if (!parsed.createdAt || Date.now() - parsed.createdAt > 5 * 60 * 1000) {
      throw new Error("OTP expired");
    }
    if (parsed.otp !== otp) throw new Error("Invalid OTP");

    const { otp: _, ...userData } = parsed;
    const createdUser = await this._userRepo.createUser(userData);
    console.log(
      "VALUES for verification:",
      "Submitted OTP:",
      otp,
      "Redis object:",
      parsed,
      "CreatedAt diff (ms):",
      Date.now() - parsed.createdAt
    );

    const accessToken = generateAccessToken(createdUser.id.toString());
    const refreshToken = generateRefreshToken(createdUser.id.toString());

    // Store refreshToken in Redis for validation/revocation
    await redisClient.setEx(
      `refresh:${createdUser.id}`,
      7 * 24 * 60 * 60, // 7 days in seconds
      refreshToken
    );
    await redisClient.del(key);
    return { accessToken, refreshToken, user: createdUser };
  };

  resendOtp = async (email: string) => {
    const key = `signup:${email}`;
    const redisData = await redisClient.get(key);
    if (!redisData) throw new Error("OTP expired or not found, signup again.");

    const parsed = JSON.parse(redisData);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    parsed.otp = otp;
    parsed.createdAt = Date.now();
    await redisClient.setEx(key, 300, JSON.stringify(parsed)); //5 min for resended otp set aavan.
    console.log("parsed.createdAT", parsed.createdAt);
    console.log(otp);

    await sendOtpEmail(email, otp);
  };

  refreshToken = async (
    refreshToken: string
  ): Promise<{ accessToken: string }> => {
    if (!refreshToken) throw new Error("No refresh token provided");

    let payload: string | JwtPayload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
    } catch {
      throw new Error("Refresh token invalid or expired");
    }

    // Type check and extract user id from payload
    let userId: string;
    if (typeof payload === "object" && payload && "id" in payload) {
      userId = (payload as JwtPayload & { id: string }).id;
    } else {
      throw new Error("Invalid refresh token payload - user id missing.");
    }

    // Check against Redis
    const storedToken = await redisClient.get(`refresh:${userId}`);
    if (storedToken !== refreshToken)
      throw new Error("Refresh token is revoked or does not match");

    // Generate new access token
    const accessToken = generateAccessToken(userId);
    return { accessToken };
  };

  login = async (
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserModel;
  }> => {
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");
    if (user.isBlocked) {
      throw new Error("You are banned and cannot login.");
    }
    const userId = user.id.toString();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await redisClient.setEx(
      `refresh:${userId}`,
      7 * 24 * 60 * 60,
      refreshToken
    );

    return { accessToken, refreshToken, user };
  };

  googleLogin = async (
    idToken: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserModel;
  }> => {
    if (!idToken) throw new Error("Missing Google ID token");

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Unable to verify Google token");
    }

    const email = payload.email;
    const username = payload.name || email.split("@")[0];

    // Find or create user
    let user = await this._userRepo.findByEmail(email);
    if (!user) {
      // Create a random password for Google users (not used for login)
      const randomPassword = await bcrypt.hash(
        jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "5m" }),
        10
      );
      user = await this._userRepo.createUser({
        username,
        email,
        password: randomPassword,
        role: "user" as any,
        isBlocked: false,
      } as any);
    }

    if (user.isBlocked) {
      throw new Error("You are banned and cannot login.");
    }

    const userId = user.id.toString();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await redisClient.setEx(
      `refresh:${userId}`,
      7 * 24 * 60 * 60,
      refreshToken
    );

    return { accessToken, refreshToken, user };
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await this._userRepo.findByEmail(email);
    if (!user) return; // Always return success (don't leak info)

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Save to user
    (user as any).resetPasswordToken = tokenHash;
    (user as any).resetPasswordExpires = expires;
    await (user as any).save();

    // Frontend URL, adjust as needed
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    await sendResetPasswordLink(
      user.email,
      "Password Reset",
      `Click here to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore.`
    );
    // NOTE: sendOtpEmail could be renamed for generic mail
  };

  resetPassword = async (
    userId: string,
    token: string,
    newPassword: string
  ): Promise<void> => {
    const user = await this._userRepo.findById(userId);
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires)
      throw new Error("Invalid or expired reset link");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (
      user.resetPasswordToken !== tokenHash ||
      user.resetPasswordExpires < new Date()
    )
      throw new Error("Invalid or expired reset link");

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await (user as any).save();
  };
}