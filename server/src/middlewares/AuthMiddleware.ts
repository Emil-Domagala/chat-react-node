import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type BasicType = (req: Request, res: Response, next: NextFunction) => void;

export const verifyWebToken: BasicType = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(404).send({ message: 'You are not Autenticated' });
  jwt.verify(token, process.env.JWT_KEY, async (err: any, payload: any) => {
    if (err) return res.status(403).send({ message: 'Token is invalid' });
    req.userId = payload.userId;
    next();
  });
};
