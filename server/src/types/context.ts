import type { Request, Response } from 'express';

export interface Context {
  user?: {
    _id: string;
    email: string;
    username: string;
  };
  req: Request;
  res: Response;
}