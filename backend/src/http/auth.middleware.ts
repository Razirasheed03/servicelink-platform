import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ResponseHelper } from "./ResponseHelper";
import { HttpResponse } from "../constants/MessageConstant";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];
    if (!token) {
      return ResponseHelper.unauthorized(res, HttpResponse.NO_TOKEN);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET! ) as { id: string };
    req.userId = decoded.id;
    return next();
  } catch (err: any) {
    return ResponseHelper.unauthorized(res, HttpResponse.UNAUTHORIZED);
  }
}
