import {NextFunction, Request, Response} from 'express';
import {CreateGroupInput, GetGroupInput, getGroupSchema} from "../schemas/group.schema";
import config from 'config';
import {Group} from "../entities/group.entity";
import {Bridge} from "../entities/bridge.entity";
import {Channel} from "../entities/channel.entity";
import AppError from "../errors/appError";
import {randomBytes} from "crypto";

import {AppDataSource} from "../db/data-source";
import {CreateChannelInput} from "../schemas/channel.schema";
import {channel} from "diagnostics_channel";

const groupRepository = AppDataSource.getRepository(Group)
const bridgeRepository = AppDataSource.getRepository(Bridge)
const channelRepository = AppDataSource.getRepository(Channel)

import MatterbridgeManager from '../matterbridge/process';

import logger from "../logging";

export const createChannelHandler = async(
    req: Request<{}, {}, CreateChannelInput>,
    res: Response
) => {
    try {
//     Validate that we were given the right bridge

        let bridge = await bridgeRepository.findOne({
            where: {state_token: req.session.state_token},
            relations: {channels: true}
        })
        if (bridge.id !== req.body.bridge_id) {
            return res.status(403).json({
                status: 'failed',
                message: 'Bridge id does not match session token'
            })
        }

        let group = await groupRepository.findOne({
            where: {invite_token: req.body.invite_token},
            relations: {channels: true}
        })

        let channel = await channelRepository.findOneBy({
            name: req.body.channel_name,
            bridge: {id: bridge.id},
            group: {id: group.id}
        })

        if (!channel) {
            // create new
            channel = new Channel()
        }
        // update properties
        channel.name = req.body.channel_name
        channel.bridge = bridge
        channel.group = group

        channel = await channelRepository.save(channel)

        await groupRepository
            .createQueryBuilder()
            .relation(Group, 'channels')
            .of(group)
            .add(channel)

        await bridgeRepository
            .createQueryBuilder()
            .relation(Bridge, 'channels')
            .of(bridge)
            .add(channel)

        logger.debug('Created new channel: %s', channel)

        await MatterbridgeManager.spawnProcess(group.name)

        logger.debug('Spawned process for %s', group.name)

        return res.status(200).json({
            status: 'success',
            data: channel
        })
    } catch (err) {
        logger.error('failed to create channel', err)
        return res.status(502).json({
            status: 'failed',
            message: 'failed to create channel'
        })
    }

}
