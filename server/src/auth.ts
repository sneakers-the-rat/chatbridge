import config from 'config';
import {createHash} from "crypto";
import AppError from "./errors/appError";

export const tokenHasher = (token:string) => {
    if (token === undefined){
        return ''
    }

    let hash = createHash('blake2b512');
    hash.update(token);
    return hash.digest('hex');
}

const admin_token = config.get<string>('admin_token');
export const hashed_token = tokenHasher(admin_token)

if (hashed_token === ""){
    throw new Error('Hashed admin token cannot be empty')
}