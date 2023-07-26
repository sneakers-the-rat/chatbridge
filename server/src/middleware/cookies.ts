import cookieSession from 'cookie-session';
import config from 'config';
import {Request, Response, NextFunction} from "express";
import { tokenHasher, hashed_token } from "../auth";

const cookieConfig = config.get<{
    'key1': string,
    "key2": string
}>('cookies')



export const cookieMiddleware = cookieSession({
    name: 'session',
    keys: [cookieConfig.key1, cookieConfig.key2],
    signed: true,

})

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.hashed_token === hashed_token){
        next();
    } else {
        let token_input = req.params.token ?? req.body.token ?? req.query.token
        let hashed_user_token = tokenHasher(token_input);
        if (hashed_user_token === hashed_token) {
            next();
        } else{
            return res.status(403).json({
                status: 'fail',
                message: 'this action requires you to be logged in as an administrator'
            });
        }
    }
};
