
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden");
    }

    next();
  };

export default authorize;