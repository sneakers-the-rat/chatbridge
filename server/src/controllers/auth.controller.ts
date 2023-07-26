import {NextFunction, Request, Response} from 'express';
import {CheckAdminInput} from "../schemas/auth.schema";
import { hashed_token, tokenHasher} from "../auth";




export const checkAdminToken = async(
    req: Request<{},{},CheckAdminInput>,
    res: Response
) => {
    let hashed_user_token = tokenHasher(req.body?.token)

    if (hashed_user_token === hashed_token ||
        req.session?.hashed_token === hashed_token
    ){
        req.session.hashed_token = hashed_token;
        console.log("Logged in with admin token")
        res.status(200).json({
            status: 'success',
            message: "Correct admin token!"
        });
    } else {
        req.session.logged_in = false;

        console.log("Login with admin token failed")
        return res.status(403).json({
            status:'fail',
            message: "Incorrect admin token!"
        })
    }
}
