require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import { AppDataSource } from './db/data-source';





AppDataSource.initialize()
  .then(async () => {

    const app = express();

    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

  })
