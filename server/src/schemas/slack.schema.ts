import { object, string, TypeOf } from 'zod';

export const joinSlackChannelSchema = object({
    body: object({
        channel_id: string({
            required_error: "Channel ID required!"
        }),
    })
})



export type JoinSlackChannelInput = TypeOf<typeof joinSlackChannelSchema>['body'];