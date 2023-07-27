import {NextFunction, Request, Response} from 'express';
import {CreateGroupInput, GetGroupInput, getGroupSchema} from "../schemas/group.schema";
import config from 'config';
import {Group} from "../entities/group.entity";
import AppError from "../errors/appError";
import {randomBytes} from "crypto";

import {AppDataSource} from "../db/data-source";

import {hashed_token} from "../auth";

const groupRepository = AppDataSource.getRepository(Group)

export const createGroupHandler = async(
    req: Request<{}, {}, CreateGroupInput>,
    res: Response
) => {
    // console.log(req.body);
    // const admin_token = config.get<string>('admin_token');
    // if (req.body?.token !== admin_token && req.session.hashed_token !== hashed_token){
    //     return res.status(403).json({
    //         status: 'fail',
    //         message: 'Not authorized to create group without correct admin token'
    //     })
    // }

    // Make new invite token as a random UUID
    // let invite_token = randomUUID();
    //  doesn't need to be as long as that...
    let invite_token = randomBytes(8).toString('hex');

    let group = await groupRepository.create({...req.body, invite_token})
    let result = await groupRepository.save(group)
    console.log("Group successfully created")
    console.log(result)
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
        console.log(group);
        if (group.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: `No group with matching name exists. given name: ${query}`
            })
        }

        console.log("Groups retrieved", group);

        return res.status(200).json({
            status: 'success',
            data: [
                ...group
            ]
        })

    } catch (err: any) {
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

export const getGroupsHandler = async(
    req: Request,
    res: Response
) => {

}