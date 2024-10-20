import { Request, Response, NextFunction } from 'express';

export function filterRequest(req: Request, res: Response, next: NextFunction) {
  if (
    req.headers['content-encoding'] &&
    (req.headers['content-encoding'].toUpperCase() === `UTF-8` ||
      req.headers['content-encoding'].toUpperCase() === `UTF8`)
  ) {
    delete req.headers['content-encoding'];
  }
  next();
}
