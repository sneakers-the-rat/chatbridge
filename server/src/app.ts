require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import { AppDataSource } from './db/data-source';
import AppError from './errors/appError';

import MatterbridgeManager from "./matterbridge/process";

import {cookieMiddleware} from "./middleware/cookies";
import groupRoutes from "./routes/group.routes";
import slackRoutes from "./routes/slack.routes";
import authRoutes from "./routes/auth.routes";
import bridgeRoutes from './routes/bridge.routes';



AppDataSource.initialize()
  .then(async () => {



    const app = express();
    app.use(express.json({limit: "10kb"}));
    app.use(cookieMiddleware);

    app.get('/healthcheck', async (_, res: Response) => {
        res.status(200).json({
            status: "online!!!!"
        })
    })

    app.use('/groups', groupRoutes);
    app.use('/auth', authRoutes)

    // app.use('/slack', async (req:Request, res:Response) => {
    //     console.log(req)
    //     let code = req.query.code;
    // });

    app.use('/slack', slackRoutes);
    app.use('/bridge', bridgeRoutes)

    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    const port = config.get<number>('port');
    app.listen(port);

    console.log(`Server started on port: ${port}`)

    // await MatterbridgeManager.spawnAll();
    // console.log('Spawned group processes:');
    // let proclist = await MatterbridgeManager.processes;
    // console.log(proclist);

  })
