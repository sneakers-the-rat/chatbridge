import config from 'config';
const { InstallProvider, LogLevel, FileInstallationStore } = require('@slack/oauth');
import {NextFunction, Request, Response} from 'express';
import {AppDataSource} from "../db/data-source";
import {Bridge} from "../entities/bridge.entity";
import {Group} from "../entities/group.entity";
import {JoinSlackChannelInput} from "../schemas/slack.schema";
import { randomUUID } from "crypto";
import {log} from "util";
import {Join} from "typeorm";

const scopes = ['bot', 'channels:write', 'chat:write:bot', 'chat:write:user', 'users.profile:read'];
const bridgeRepository = AppDataSource.getRepository(Bridge)
const groupRepository = AppDataSource.getRepository(Group)

const SLACK_COOKIE_NAME = "slack-oauth-state";

const slackConfig = config.get<{
    client_id: string,
    client_secret: string,
    signing_secret: string,
    state_secret: string
}>('slackConfig');

const installer = new InstallProvider({
    clientId: slackConfig.client_id,
    clientSecret: slackConfig.client_secret,
    authVersion: 'v1',
    scopes,
    // stateSecret: slackConfig.state_secret,
    stateVerification: false,
    // installationStore: new FileInstallationStore(),
    logLevel: LogLevel.DEBUG,
    // stateCookieName: SLACK_COOKIE_NAME

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

    res.cookie(SLACK_COOKIE_NAME, state_token, { maxAge: 60*5 })
    res.status(200).json({
        status: 'success',
        data: {
            url,
            state_token
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
        // console.log(installation, installOptions, req.body, req.content, req.query, req.params)
        // console.log(installation.team.id, installation.team.name, installation.bot.token);
          let bridge_data = {
              'Protocol': 'slack',
              'Label': installation.team.name,
              'team_id': installation.team.id,
              'team_name': installation.team.name,
              'state_token': req.session.state_token,
              'Token': installation.bot.token
          }

          // check if we have an entity
          let bridge = await bridgeRepository.findOneBy({Token: installation.bot.token})
          let result
          if (!bridge){
              bridge = await bridgeRepository.create(bridge_data);
              await bridgeRepository.save(bridge);
              console.log('created bridge')
          } else {
              await bridgeRepository.update(
                  {Token: installation.bot.token},
                  {state_token: req.session.state_token})
              console.log('updated bridge')
          }
          res.send('<html><body><h1>Success! Return to the chatbridge login window.</h1><h3>This tab will close in 3 seconds...</h3><script>window.setTimeout(window.close, 3000)</script></body>')

      },
      failure: (error, installOptions , req, res) => {
          console.log(error, installOptions, req.body, req.content, req.query, req.params)
        res.send('failure. Something is broken about chatbridge :(');
      },
    }


    await installer.handleCallback(req, res, callbackOptions);

}

export const getChannelsHandler = async(
    req: Request,
    res: Response
) => {
    let bridge = await bridgeRepository.findOneBy({state_token: req.session.state_token})
    console.log('bridge data', bridge)

    try {
        fetch('https://slack.com/api/conversations.list', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bridge.Token}`
            }
        }).then(result => result.json())
            .then((result) => {
                console.log('channels',result)
                let channels = result.channels.map(
                    (chan: { name: string; }) => {
                        return chan.name
                    }
                );
                res.status(200).json({
                    status: 'success',
                    data: {
                        channels
                    }
                })
            })
    } catch {
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
    let bridge = await bridgeRepository.findOneBy({state_token: req.session.state_token})
    console.log('bridge data', bridge)

    try {
        // Get channel ID from channel name
        let channels_res = await fetch('https://slack.com/api/conversations.list', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bridge.Token}`
            }
        })
        let channels = <{ channels: { name: string, id: string }[] }>channels_res.json()
        let channel_id = channels.channels.filter(
            (chan) => {
                return (chan.name == req.body.channel)
            }
        ).map(chan => chan.id)[0]
        console.log('channel id', channel_id)

        // Join channel from ID
        fetch('https://slack.com/api/conversations.join', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bridge.Token}`
            },
            body: JSON.stringify({
                channel: channel_id
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.ok) {
                    res.status(200).json({
                        status: 'success',
                        data: {
                            channels
                        }
                    })
                } else {
                    res.status(502).json({
                        status: 'failure',
                        message: 'Couldnt join channel'
                    })
                }
            })

    } catch {
        return res.status(502).json({
            status: 'failure',
            message: "Couldn't join channel!"
        })
    }
}
