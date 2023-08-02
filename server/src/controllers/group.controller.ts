import {NextFunction, Request, Response} from 'express';
import {CreateGroupInput, GetGroupInput, getGroupSchema} from "../schemas/group.schema";
import config from 'config';
import {Group} from "../entities/group.entity";
import AppError from "../errors/appError";
import {randomBytes} from "crypto";

import {AppDataSource} from "../db/data-source";

const groupRepository = AppDataSource.getRepository(Group)

import logger from "../logging";

export const createGroupHandler = async(
    req: Request<{}, {}, CreateGroupInput>,
    res: Response
) => {

    let invite_token = randomBytes(8).toString('hex');

    let group = await groupRepository.create({...req.body, invite_token})
    let result = await groupRepository.save(group)
    logger.info("Group successfully created: %s", result)
    return res.send({"status": "success", "data": result})

}

export const getGroupHandler = async(
    req: Request<GetGroupInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        let query = req.body.name ?? req.query.name ?? undefined
        let group;
        if (query){
            group = await groupRepository.findBy({name: query})
        } else {
            group = await groupRepository.find()
        }
        if (group.length === 0) {
            logger.info("failed to get group with name %s", query)
            return res.status(404).json({
                status: 'failed',
                message: `No group with matching name exists. given name: ${query}`
            })
        }

        logger.info("Groups retrieved %s", group);

        return res.status(200).json({
            status: 'success',
            data: [
                ...group
            ]
        })

    } catch (err: any) {
        logger.debug('Error getting groups', err)
        next(err);
    }
};

export const getGroupWithInviteHandler = async(
    req: Request,
    res:Response,
    next: NextFunction
) => {
    let group = await groupRepository.findOneBy({invite_token: req.body.token})
    if (!group) {
        return res.status(404).json({
            status: 'failed',
            message: `No group with matching invite code exists.`
        })
    } else {
        req.session.groups = req.session.groups || [];
        if (!req.session.groups.includes(req.body.token)) {
            req.session.groups.push(req.body.token);
        }
        return res.status(200).json({
            status: 'success',
            data: group
        })
    }

}

export const deleteGroupHandler = async(
    req: Request,
    res:Response,
) => {
    let group = await groupRepository.findOneBy({id: req.body.id})
    if (group){
        await groupRepository.remove(group)
        return res.status(200).json({
            status: 'success',
            message: 'Group successfully deleted!'
        })
    } else {
        return res.status(404).json({
            status: 'failed',
            message: 'no group with matching ID found'
        })
    }

}

export const getGroupsHandler = async(
    req: Request,
    res: Response
) => {

}
