import express from 'express';

import {
    getBridgeHandler,
    setBridgeHandler
} from "../controllers/bridge.controller";

import {
    updateBridgeSchema
} from "../schemas/bridge.schema";

import { validate } from "../middleware/validate";

const router = express.Router();

router.route('/')
    .get(getBridgeHandler)
    .post(validate(updateBridgeSchema), setBridgeHandler)

export default router