import express from 'express';

import {
    createChannelHandler
} from "../controllers/channel.controller";

import {
    requireStateToken
} from "../middleware/cookies";

import {validate} from "../middleware/validate";

import {createChannelSchema} from "../schemas/channel.schema";

const router = express.Router();

router.route('/create')
    .post(requireStateToken,
        validate(createChannelSchema),
        createChannelHandler)

export default router