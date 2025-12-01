import nodemailer from "nodemailer";
export const sendOtpEmail = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TailMate" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your TailMate OTP Code",
    text: `Your OTP for verification is: ${otp}. It is valid for 2 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response); 
  } catch (err) {
    console.error('Failed to send OTP mail:', err);
    throw err;
  }
};