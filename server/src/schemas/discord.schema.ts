import { object, string, TypeOf } from 'zod';

export const discordOauthRedirectSchema = object({
    query: object({
        code: string(),
        state: string(),
        guild_id: string(),
        permissions: string()
    })
})



export type DiscordOauthRedirectInput = TypeOf<typeof discordOauthRedirectSchema>['query'];