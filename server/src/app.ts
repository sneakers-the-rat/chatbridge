require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import cors from 'cors';
import { AppDataSource } from './db/data-source';
import AppError from './errors/appError';
import {killMatterbridge} from "./matterbridge/process";
import MatterbridgeManager from "./matterbridge/process";

import {cookieMiddleware} from "./middleware/cookies";
import groupRoutes from "./routes/group.routes";
import slackRoutes from "./routes/slack.routes";
import authRoutes from "./routes/auth.routes";
import bridgeRoutes from './routes/bridge.routes';
import channelRoutes from './routes/channel.routes';
import discordRoutes from "./routes/discord.routes";

import logger from "./logging";




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
    app.use('/auth', authRoutes);
    app.use('/slack', slackRoutes);
    app.use('/bridge', bridgeRoutes);
    app.use('/channel', channelRoutes);
    app.use('/discord', discordRoutes);

    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    const port = config.get<number>('port');
    const server = app.listen(port);
    logger.info(`Server started on port: ${port}`)

    await MatterbridgeManager.spawnAll();
    let proclist = await MatterbridgeManager.processes;
    logger.info('Spawned group processes: %s', proclist);


      //  Register signal handlers
      process.on('SIGTERM', () => {
          logger.debug('killing matterbridge from SIGTERM')
          killMatterbridge()
          server.close()
            process.exit(0)
      })
      process.on('exit', () => {
          logger.debug('killing matterbridge from exit event')
          killMatterbridge()
          server.close()
      })


  })

// Kill matterbridge processes on app exit.

