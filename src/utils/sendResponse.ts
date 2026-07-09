import { Response } from "express";

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>(
  res: Response,
  payload: TResponse<T>
) => {
  res.status(payload.statusCode).json(payload);
};

export default sendResponse;