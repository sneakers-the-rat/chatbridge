import express from 'express';

import {
    SlackInstallLinkHandler,
    SlackCallbackHandler,
    getChannelsHandler,
    joinChannelsHandler,
    getBotInfo
} from '../controllers/slack.controller'

import {
    requireStateToken
} from "../middleware/cookies";

const router = express.Router();

router.route('/install')
    .get(SlackInstallLinkHandler)

router.route('/oauth_redirect')
    .get(SlackCallbackHandler)

router.route('/channels')
    .get(requireStateToken, getChannelsHandler)
    .post(requireStateToken, joinChannelsHandler)

router.route('/info')
    .get(requireStateToken, getBotInfo)


export default router