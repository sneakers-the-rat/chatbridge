import express from 'express';

import {
    createGroupHandler,
    getGroupHandler
} from "../controllers/group.controller";

import {
    createGroupSchema
} from "../schemas/group.schema";

import { validate } from "../middleware/validate";

const router = express.Router();

router
    .route('/')
    .post(createGroupHandler)
    .get(getGroupHandler)

export default router
