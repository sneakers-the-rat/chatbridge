import {NextFunction, Request, Response} from 'express';
import {CreateGroupInput, GetGroupInput, getGroupSchema} from "../schemas/group.schema";
import config from 'config';
import {Group} from "../entities/group.entity";
import AppError from "../errors/appError";

import {AppDataSource} from "../db/data-source";

const groupRepository = AppDataSource.getRepository(Group)

export const createGroupHandler = async(
    req: Request<{}, {}, CreateGroupInput>,
    res: Response
) => {
    console.log(req.body);
    const admin_token = config.get<string>('admin_token');
    if (req.body.token !== admin_token){
        return res.status(403).json({
            status: 'fail',
            message: 'Not authorized to create group without correct admin token'
        })
    }

    let group = await groupRepository.create({...req.body})
    let result = await groupRepository.save(group)
    return res.send(result)

}

export const getGroupHandler = async(
    req: Request<GetGroupInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        let group = await groupRepository.findOneBy({name: req.params.name})

        if (!group) {
            return next(new AppError(404, "No group with matching name exists"))
        }

        return res.status(200).json({
            status: 'success',
            data: {
                group
            }
        })

    } catch (err: any) {
        next(err);
    }
};