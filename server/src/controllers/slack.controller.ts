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

const scopes = ['bot', 'channels:write', 'channels:write.invites', 'chat:write:bot', 'chat:write:user', 'users.profile:read'];
const bridgeRepository = AppDataSource.getRepository(Bridge)
const groupRepository = AppDataSource.getRepository(Group)

const SLACK_COOKIE_NAME = "slack-oauth-state";

const slackConfig = config.get<{
    client_id: string,
    client_secret: string,
    signing_secret: string,
    state_secret: string
}>('slackConfig');

export interface slackChannel {
    id: string;
    name: string;
    is_channel: boolean;
    is_group: boolean;
    is_im: boolean;
    is_mpim: boolean;
    is_private: boolean;
    created: number;
    is_archived: boolean;
    is_general: boolean;
    unlinked: number;
    name_normalized: string;
    is_shared: boolean;
    is_org_shared: boolean;
    is_pending_ext_shared: boolean;
    pending_shared: [];
    context_team_id: string;
    updated: number;
    creator: string;
    is_ext_shared: boolean;
    shared_team_ids: string[];
    is_member: boolean;
    num_members: number;
}

export interface authTest {
    ok: boolean;
    url: string;
    team: string;
    user: string;
    team_id: string;
    user_id: string;
    bot_id: string;
    is_enterprise_install: boolean;
}

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
      success: async (installation:any, installOptions:any, req:Request, res:Response) => {
        // console.log(installation, installOptions, req.body, req.content, req.query, req.params)
        // console.log(installation.team.id, installation.team.name, installation.bot.token);
          console.log('istallation info', installation)
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
          console.log('bot token', installation.bot.token)

          // check if we have an entity
          let bridge = await bridgeRepository.findOneBy({Token: installation.bot.token})
          let result
          if (!bridge){
              bridge = await bridgeRepository.create(bridge_data);
              await bridgeRepository.save(bridge);
              console.log('created bridge')
          } else {
              // await bridgeRepository.update(
              //     {Token: installation.bot.token},
              //     {
              //         state_token: req.session.state_token,
              //         user_token: installation.access_token,
              //         bot_id: installation.bot.bot_user_id
              //
              //     },
              //
              //     )
              console.log('existing bridge', bridge)
              // Don't overwrite existing label
              bridge_data.Label = bridge.Label
              bridge_data = {...bridge, ...bridge_data}
              console.log('updating bridge with', bridge_data)
              let newbridge = await bridgeRepository.save(bridge_data)
              console.log('updated bridge', newbridge)
              console.log('updated bridge')
          }
          res.send('<html><body><h1>Success! Return to the chatbridge login window.</h1><h3>This tab will close in 3 seconds...</h3><script>window.setTimeout(window.close, 3000)</script></body>')

      },
      failure: (error:any, installOptions:any , req:Request, res:Response) => {
          // console.log(error, installOptions, req.body, req.content, req.query, req.params)
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
    // console.log('bridge data', bridge)

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
    console.log('joinchannel bridge', bridge)
    console.log('joinchannel chanid', req.body.channel_id)
    console.log('joinchannel userid', bridge.user_token)
    console.log('joinchannel botid', bridge.bot_id)
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
                console.log(result);
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

//         try and invite bot



}

// export const joinChannelsHandler = async(
//     req: Request<{}, {}, JoinSlackChannelInput>,
//     res: Response
// ) => {
//     let bridge = await bridgeRepository.findOneBy({state_token: req.session.state_token})
//     console.log('bridge data', bridge)
//
//     try {
//         // Get channel ID from channel name
//         let channels_res = await fetch('https://slack.com/api/conversations.list', {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${bridge.Token}`
//             }
//         })
//         let channels = <{ channels: slackChannel[] }><unknown> await channels_res.json()
//         let channel_id = channels.channels.filter(
//             (chan) => {
//                 return (chan.name == req.body.channel)
//             }
//         ).map(chan => chan.id)[0]
//         console.log('channel id', channel_id)
//         console.log('bridge token', `Bearer ${bridge.Token}`)
//         // Join channel from ID
//         fetch('https://slack.com/api/conversations.join', {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${bridge.Token}`
//             },
//             body: JSON.stringify({
//                 channel: channel_id
//             })
//         }).then(result => result.json())
//             .then((result) => {
//                 console.log('result', result)
//                 if (res.ok) {
//                     res.status(200).json({
//                         status: 'success',
//                         data: {
//                             channels
//                         }
//                     })
//                 } else {
//                     res.status(502).json({
//                         status: 'failure',
//                         message: 'Couldnt join channel'
//                     })
//                 }
//             })
//
//     } catch (error) {
//         console.log('channel join error', error)
//         return res.status(502).json({
//             status: 'failure',
//             message: "Couldn't join channel!"
//         })
//     }
// }

export const getBotInfo = async(
    req: Request,
    res: Response
) => {
    let bridge = await bridgeRepository.findOneBy({state_token: req.session.state_token})
    // console.log('bridge data', bridge)

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
        console.log('auth.test error', error)
        return res.status(502).json({
            status:'failure',
            message:'Couldnt get bot info'
        })
    }
}
