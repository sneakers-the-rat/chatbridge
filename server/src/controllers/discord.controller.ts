
import {Request, Response} from "express";
import {randomUUID} from "crypto";
import config from "config";
import {discordConfigType} from "../types/config";
import {DiscordBridge} from "../entities/bridge.entity";
import {AppDataSource} from "../db/data-source";



const discordBridgeRepository = AppDataSource.getRepository(DiscordBridge)
const discordConfig = config.get<discordConfigType>('discordConfig');

export const DiscordInstallLinkHandler = async(
  req: Request,
  res: Response
) => {
  let state_token = randomUUID()
  req.session.state_token = state_token;

  const url = `https://discordapp.com/oauth2/authorize?&client_id=${discordConfig.client_id}&scope=bot&permissions=536870912&state=${state_token}`

    res.status(200).json({
      status: 'success',
      data: {
        url
      }
    })


}


export const DiscordOAuthHandler = async(
  req: Request,
  res: Response
) => {
  console.log('discord oauth', req.body, req.query)
}
