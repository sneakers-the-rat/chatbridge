# chatbridge

Like guppe groups but for slack, discord, matrix, etc.

Invite people to a matterbridge group with a token

Using matterbridge - https://github.com/42wim/matterbridge

Very unfinished!! Mostly a programming exercise for me for now to practice fullstack. Theoretically it should be possible to reuse this but i make no guarantees especially while it is yno unfinished and potentially insecure. run at your own risk!

## TODO

- [x] Manage matterbridge processes
- [ ] Sanitize user inputs
- [ ] Check status of matterbridge processes
- [x] Complete slack login workflow
- [ ] Kill group processes & delete config when group is deleted

## Supported Clients 

(the ones that can use the website to join)

- [Slack](#Slack)
- [Discord](#Discord)

### Slack

- Set up Slack App with old style bot according to matterbridge instructions: https://github.com/42wim/matterbridge/wiki/Slack-bot-setup
- Configure slack app to use the callback API url: `<yourdomain.etc.>/api/slack/oauth_redirect`
- Set your `.env` variables!

### Discord

- Set up Discord App according to matterbridge instructions: https://github.com/42wim/matterbridge/wiki/Discord-bot-setup
- Additionally enable "[Requires OAUTH2 Code Grant](https://discord.com/developers/docs/topics/oauth2#advanced-bot-authorization)" in your bot's authorization flow settings
- Set the redirect URL to `<yourdomain.etc>/api/discord/oauth_redirect`

## Deployment

Use the ansible role!!!


## References

idk i'm just learnin

- https://typeorm.io/active-record-data-mapper#what-is-the-active-record-pattern
  - https://typeorm.io/example-with-express
- https://github.com/wpcodevo/node_typeorm/tree/restapi-node-typeorm
- https://www.axllent.org/docs/nodejs-service-with-systemd/
- https://github.com/wpcodevo/Blog_MUI_React-hook-form/tree/login-signup-form
- https://blog.alexdevero.com/build-react-app-express-api/
- https://www.react.express/
- https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
	- https://www.typescriptlang.org/docs/handbook/compiler-options.html
- https://galaxy.ansible.com/jwflory/matterbridge
