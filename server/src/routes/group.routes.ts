import express from 'express';

import {
    createGroupHandler,
    getGroupHandler
} from "../controllers/group.controller";

import {
    createGroupSchema
} from "../schemas/group.schema";

import { validate } from "../middleware/validate";
import { requireAdmin } from "../middleware/cookies";

const router = express.Router();

router
    .route('/')
    .post(validate(createGroupSchema), requireAdmin, createGroupHandler)
    .get(requireAdmin, getGroupHandler)

export default router
