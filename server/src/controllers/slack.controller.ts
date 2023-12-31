import config from 'config';
import {Request, Response} from 'express';
import {AppDataSource} from "../db/data-source";
import {Bridge, SlackBridge} from "../entities/bridge.entity";
import {Group} from "../entities/group.entity";
import {JoinSlackChannelInput} from "../schemas/slack.schema";
import {randomUUID} from "crypto";
import logger from "../logging";
import {authTest, slackChannel } from "../types/slack";
import { slackConfigType } from "../types/config";

const { InstallProvider, LogLevel, FileInstallationStore } = require('@slack/oauth');

const scopes = ['bot', 'channels:write', 'channels:write.invites', 'chat:write:bot', 'chat:write:user', 'users.profile:read'];
const slackBridgeRepository = AppDataSource.getRepository(SlackBridge)
const groupRepository = AppDataSource.getRepository(Group)

// const SLACK_COOKIE_NAME = "slack-oauth-state";

const slackConfig = config.get<slackConfigType>('slackConfig');

const installer = new InstallProvider({
    clientId: slackConfig.client_id,
    clientSecret: slackConfig.client_secret,
    authVersion: 'v1',
    scopes,
    stateVerification: false,
    logLevel: LogLevel.DEBUG,
})


export const SlackInstallLinkHandler = async(
    req: Request,
    res: Response
) => {
    let state_token = randomUUID()
    req.session.state_token = state_token;

    const url = await installer.generateInstallUrl(
        {
                scopes,
                metadata: {token: state_token, group: req.query.group}
            },
        true,
           state_token
    );

    // res.cookie(SLACK_COOKIE_NAME, state_token, { maxAge: 60*5 })
    res.status(200).json({
        status: 'success',
        data: {
            url
        }
    })

}

export const SlackCallbackHandler = async(
    req: Request,
    res: Response
) => {
    // using custom success and failure handlers
    const callbackOptions = {
      success: async (installation:any, installOptions:any, req:Request, res:Response) => {
        // console.log(installation, installOptions, req.body, req.content, req.query, req.params)
        // console.log(installation.team.id, installation.team.name, installation.bot.token);
          logger.debug('slack installation info: %s', installation)
          let bridge_data = {
              'Protocol': 'slack',
              'Label': installation.team.name,
              'team_id': installation.team.id,
              'team_name': installation.team.name,
              'state_token': req.session.state_token,
              'Token': installation.bot.token,
              'user_token': installation.user.token,
              'bot_id': installation.bot.userId
          }

          // check if we have an entity
          let bridge = await slackBridgeRepository.findOneBy({Token: installation.bot.token})
          logger.debug('found existing bridge %s', bridge)
          if (!bridge){
              logger.debug('creating new bridge')
              bridge = await slackBridgeRepository.create(bridge_data);
              await slackBridgeRepository.save(bridge);
              logger.debug('created bridge')
          } else {

              logger.debug('existing bridge: %s', bridge)
              // Don't overwrite existing label
              bridge_data.Label = bridge.Label
              bridge_data = {...bridge, ...bridge_data}
              let newbridge = await slackBridgeRepository.save(bridge_data)
          }
          res.send('<html><body><h1>Success! Return to the chatbridge login window.</h1><h3>This tab will close in 3 seconds...</h3><script>window.setTimeout(window.close, 3000)</script></body>')

      },
      failure: (error:any, installOptions:any , req:Request, res:Response) => {
          logger.error('error when logging in with slack', error)
          res.send('failure. Something is broken about chatbridge :(');
      },
    }

    await installer.handleCallback(req, res, callbackOptions);

}

export const getChannelsHandler = async(
    req: Request,
    res: Response
) => {
    let bridge = await slackBridgeRepository.findOneBy({state_token: req.session.state_token})

    try {
        fetch('https://slack.com/api/conversations.list', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bridge.Token}`
            }
        }).then(result => result.json())
            .then((result) => {
                logger.debug('got slack channels: %s',result)
                let channels = result.channels.map(
                    (chan: slackChannel) => {
                        return {
                            'name': chan.name,
                            'id': chan.id,
                            'is_member': chan.is_member
                        }
                    }
                );
                res.status(200).json({
                    status: 'success',
                    data: {
                        channels
                    }
                })
            })
    } catch (error:any) {
        logger.error('Error getting slack lists', error)
        return res.status(502).json({
            status: 'failure',
            message: 'couldnt get lists!'
        })
    }

}

export const joinChannelsHandler = async(
    req: Request<{}, {}, JoinSlackChannelInput>,
    res: Response
) => {

    let bridge = await slackBridgeRepository.findOneBy({state_token: req.session.state_token})

    fetch('https://slack.com/api/conversations.invite', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bridge.user_token}`
            },
            body: JSON.stringify({
                users: bridge.bot_id,
                channel: req.body.channel_id
            })
        }).then(result => result.json())
            .then(result => {
                if (result.ok || result.error === 'already_in_channel'){
                    return res.status(200).json({
                        status: 'success',
                        data: {
                            id: req.body.channel_id
                        }
                    })
                } else {
                    return res.status(502).json({
                        status: 'failed',
                        message: "could not invite bot to channel!"
                    })
                }
            })
}

export const getBotInfo = async(
    req: Request,
    res: Response
) => {
    let bridge = await slackBridgeRepository.findOneBy({state_token: req.session.state_token})

    try {
        fetch('https://slack.com/api/auth.test', {
            headers: {
                'Authorization': `Bearer ${bridge.Token}`
            }
        }).then(response => response.json())
        .then((response: authTest) => {
            if (response.ok){
                return res.status(200).json({
                    status: 'success',
                    data: response
                })
            } else {
                return res.status(502).json({
                    status: 'failure',
                    message: 'unknown error getting auth test'
                })
            }
        })
    } catch (error) {
        logger.error('auth.test error', error)
        return res.status(502).json({
            status:'failure',
            message:'Couldnt get bot info'
        })
    }
}


