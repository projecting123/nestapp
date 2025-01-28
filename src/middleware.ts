import express from 'express';
import * as jwt from 'jsonwebtoken';

export interface CustomRequest extends express.Request {
  isAuthorized: boolean;
  user?: object;
}

export function isAuthorized(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = (req.headers.cr_id as string) || (req.cookies.cr_id as string);
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!,
    ) as jwt.JwtPayload;
    delete payload.iat;
    req.isAuthorized = true;
    req.user = payload;
    next();
  } catch (error) {
    res.json({ok: false, message: error.message});
  }
}
