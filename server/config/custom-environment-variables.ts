export default {
    port: 'PORT',
    postgresConfig: {
        host: 'POSTGRES_HOST',
        port: 'POSTGRES_PORT',
        username: 'POSTGRES_USER',
        password: 'POSTGRES_PASSWORD',
        database: 'POSTGRES_DB',
    },
    slackConfig: {
        client_id: 'SLACK_CLIENT_ID',
        client_secret: 'SLACK_CLIENT_SECRET',
        signing_secret: 'SLACK_SIGNING_SECRET',
        state_secret: 'SLACK_STATE_SECRET'
    },
    discordConfig: {
        token: 'DISCORD_TOKEN',
        client_id: "DISCORD_CLIENT_ID"
    },
    admin_token: 'ADMIN_TOKEN',
    cookies:{
        key1: 'COOKIE_KEY_1',
        key2: 'COOKIE_KEY_2'
    },
    matterbridge: {
        bin: 'MATTERBRIDGE_BINARY',
        config: 'MATTERBRIDGE_CONFIG_DIR'
    },
    logDir: 'LOG_DIR'
}
