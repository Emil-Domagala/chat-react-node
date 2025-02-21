import type { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

declare global {
  type ControllerFunctionType = (req: Request, res: Response, next?: NextFunction) => Promise<any>;

  type ControllerErrorType = {
    status: number | null;
    password: string | null;
    confirmPassword?: string | null;
    email: string | null;
    messages: string[];
  };
}

export {};
