import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded._id;

        next();
      } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Token not provided' });
    }
  }
}
