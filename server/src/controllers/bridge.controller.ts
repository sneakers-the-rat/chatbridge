import {AppDataSource} from "../db/data-source";
import {Bridge} from "../entities/bridge.entity";
import {Request, Response} from "express";
import {UpdateBridgeInput} from "../schemas/bridge.schema";

const bridgeRepository = AppDataSource.getRepository(Bridge)


export const getBridgeHandler = async(
    req: Request,
    res: Response
) => {
    if (req.session.state_token){
        let bridge = await bridgeRepository.findOne({
            where: {state_token: req.session.state_token},
            select: {
                Protocol: true,
                Label: true,
                team_name: true,
                id: true
            }
        })
        if (!bridge){
            res.status(404).json({
                status: 'failure',
                message: 'No matching bridge found'
            })
            return
        }
        res.status(200).json({
            status: 'success',
            data: bridge
        })
    } else {
        res.status(403).json({
            status: 'failure',
            message: 'No state token found'
        })
    }
}

export const setBridgeHandler = async(
    req: Request<{}, {}, UpdateBridgeInput>,
    res: Response
) => {
    if (req.session.state_token) {
        let bridge = await bridgeRepository.findOneBy({state_token: req.session.state_token})
        if (!bridge){
            res.status(404).json({
                status: 'failure',
                message: 'No matching bridge found'
            })
            return
        }
        bridge.Label = req.body.Label;
        bridge.save()
        res.status(200).json({
            status:'success'
        })
    } else {
        res.status(403).json({
            status: 'failure',
            message: 'No state token found'
        })
    }
}