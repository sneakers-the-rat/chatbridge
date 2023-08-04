import express from 'express';

import {
  DiscordInstallLinkHandler, DiscordJoinChannelsHandler, DiscordListChannelsHandler,
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

router.route('/channels')
    .get(requireStateToken, DiscordListChannelsHandler)
    .post(requireStateToken, DiscordJoinChannelsHandler)


export default router
