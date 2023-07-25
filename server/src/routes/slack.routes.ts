import express from 'express';

import {
    SlackInstallHandler,
    SlackCallbackHandler
} from '../controllers/slack.controller'

const router = express.Router();

router.route('/install')
    .get(SlackInstallHandler)

router.route('/oauth_redirect')
    .get(SlackCallbackHandler)

export default router