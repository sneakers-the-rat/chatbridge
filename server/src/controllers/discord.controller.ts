
import {Request, Response} from "express";
import {randomUUID} from "crypto";
import config from "config";
import {discordConfigType} from "../types/config";
import {DiscordBridge} from "../entities/bridge.entity";
import {AppDataSource} from "../db/data-source";
import {URL} from "url";
import {join as pathJoin} from 'path';
import {DiscordOauthRedirectInput} from "../schemas/discord.schema";
import logger from "../logging";


const discordBridgeRepository = AppDataSource.getRepository(DiscordBridge)
const discordConfig = config.get<discordConfigType>('discordConfig');

const DISCORD_AUTHORIZE_URL = 'https://discord.com/oauth2/authorize'
const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token'

let baseURL = new URL(config.get<string>('baseURL'))
baseURL.pathname = pathJoin(baseURL.pathname, '/api/discord/oauth_redirect')
const REDIRECT_URL = baseURL.toString()

export const DiscordInstallLinkHandler = async(
  req: Request,
  res: Response
) => {
  let state_token = randomUUID()
  req.session.state_token = state_token;

  let url = `${DISCORD_AUTHORIZE_URL}?response_type=code&client_id=${discordConfig.client_id}&scope=bot&permissions=536870912&state=${state_token}&redirect_url=${REDIRECT_URL}`

    res.status(200).json({
      status: 'success',
      data: {
        url
      }
    })


}


export const DiscordOAuthHandler = async(
  req: Request<{},{},{},DiscordOauthRedirectInput>,
  res: Response
) => {
  if (req.session.state_token !== req.query.state){
    logger.warning('discord state token did not match on oauth redirect')
    return res.status(401).json({
      status: 'failure',
      message: 'State token does not match!'
    })
  }

  let data = new URLSearchParams({
    client_id: discordConfig.client_id,
    client_secret: discordConfig.client_secret,
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: REDIRECT_URL
  })

  let oauth_res = await fetch(DISCORD_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data.toString()
  })
  // console.log(oauth_res.body)
  // console.log(await oauth_res.text())
  // console.log(oauth_res)
  // return res.send(await oauth_res.text())
  let oauth = await oauth_res.json()
  console.log(oauth)
  let bridge_data = {
    Protocol: 'discord',
    Label: oauth.guild.name,
    state_token: req.session.state_token,
    Token: discordConfig.token, // token is same for all bridges, guild ID/Server differentiates
    Server: oauth.guild.id,
    guild_id: oauth.guild.id,
    guild_name: oauth.guild.name,
    access_token: oauth.access_token,
    refresh_token: oauth.refresh_token
  }
  try {
    // check if we already have one
    let bridge = await discordBridgeRepository.findOneBy({
      Token: discordConfig.token,
      Server: oauth.guild.id
    })
    if (!bridge) {
      bridge = await discordBridgeRepository.create(bridge_data)
      await discordBridgeRepository.save(bridge);
      logger.debug(`Created new discord bridge for ${oauth.guild.name}`)
    } else {
      // update everything except user-set label
      bridge_data.Label = bridge.Label
      bridge_data = {...bridge, ...bridge_data}
      await discordBridgeRepository.save(bridge_data)
      logger.debug(`Updates discord bridge for ${oauth.guild.name}`)
    }
    return res.send('<html><body><h1>Success! Return to the chatbridge login window.</h1><h3>This tab will close in 3 seconds...</h3><script>window.setTimeout(window.close, 3000)</script></body>')

  } catch {
    return res.status(500).json({
      status: 'failed',
      message: 'oauth succeeded, but error creating bridge in database'
    })
  }
}

export const DiscordListChannelsHandler = async(
    req: Request,
    res: Response
) => {
    let bridge = await discordBridgeRepository.findOneBy({state_token: req.session.state_token})

    try{
      fetch(`https://discord.com/api/guilds/${bridge.guild_id}/channels`,{
        headers: {
          Authorization: `Bot ${bridge.Token}`
        }
      }).then(result => result.json())
        .then(result => {
          logger.debug('got discord channels %s', result)
          let channels = result.filter(
              (res:any) => res.type === 0
          ).map(
              (res:any) => {
                return {
                  name: res.name,
                  id: res.id
                }
              }
          )
          res.status(200).json({
            status: 'success',
            data: {
              channels
            }
          })
        })
    } catch {
      return res.status(500).json({
        status: 'failed',
        message: 'Could not list channels!'
      })
    }
}

export const DiscordJoinChannelsHandler = async(
    req: Request,
    res: Response
) => {

}