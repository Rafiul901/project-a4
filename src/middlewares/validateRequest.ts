import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
     
      const data = req.method === 'GET' ? { query: req.query } : { body: req.body };
      schema.parse(data);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors?.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  };
};

export default validateRequest;