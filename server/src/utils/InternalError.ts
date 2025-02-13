import type { Response } from 'express';

export const internalError = (err: unknown, res: Response) => {
  console.log(err);
  return res.status(500).send('Internal Server Error');
};
