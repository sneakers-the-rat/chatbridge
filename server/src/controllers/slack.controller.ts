import config from 'config';
const { InstallProvider, LogLevel, FileInstallationStore } = require('@slack/oauth');
import {NextFunction, Request, Response} from 'express';
import {AppDataSource} from "../db/data-source";
import {Bridge} from "../entities/bridge.entity";
import {Group} from "../entities/group.entity";
import { randomUUID } from "crypto";
import {log} from "util";

const scopes = ['bot', 'channels:write', 'chat:write:bot', 'chat:write:user', 'users.profile:read'];
const bridgeRepository = AppDataSource.getRepository(Bridge)
const groupRepository = AppDataSource.getRepository(Group)


const slackConfig = config.get<{
    client_id: string,
    client_secret: string,
    signing_secret: string
}>('slackConfig');

const installer = new InstallProvider({
    clientId: slackConfig.client_id,
    clientSecret: slackConfig.client_secret,
    authVersion: 'v1',
    scopes,
    stateSecret: randomUUID(),
    installationStore: new FileInstallationStore(),
    logLevel: LogLevel.DEBUG,

})

export const SlackInstallHandler = async(
    req: Request,
    res: Response
) => {


    await installer.handleInstallPath(req, res, {}, {
        scopes,
        metadata: {'name':'my-slack-name','group':'MyGroup'}
    });
}

export const SlackInstallLinkHandler = async(
    req: Request,
    res: Response
) => {
    let login_token = randomUUID()

    const url = await installer.generateInstallUrl({
        scopes,
        metadata: {token: login_token, group: req.query.group}
    });

    res.status(200).json({
        status: 'success',
        data: {
            url,
            login_token
        }
    })

}




export const SlackCallbackHandler = async(
    req: Request,
    res: Response
) => {
    // using custom success and failure handlers
    const callbackOptions = {
      success: async (installation, installOptions, req, res) => {
        console.log(installation, installOptions, req.body, req.content, req.query, req.params)
        console.log(installation.team.id, installation.team.name, installation.bot.token);
          let bridge = await bridgeRepository.create({
              'Protocol': 'slack',
              'Label': installation.metadata.name,
              'team_id': installation.team.id,
              'team_name': installation.team.name,
              'Token': installation.bot.token
          });
          let result = await bridgeRepository.save(bridge);


          res.send(result);

      },
      failure: (error, installOptions , req, res) => {
        res.send('failure');
      },
    }


    await installer.handleCallback(req, res, callbackOptions);

}