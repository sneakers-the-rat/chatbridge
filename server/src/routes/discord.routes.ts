import express from 'express';

import {
  DiscordInstallLinkHandler,
  DiscordOAuthHandler
} from "../controllers/discord.controller";

import {
  requireStateToken
} from "../middleware/cookies";

const router = express.Router();
router.route('/install')
  .get(DiscordInstallLinkHandler)

router.route('/oauth_redirect')
  .get(DiscordOAuthHandler)


export default router
