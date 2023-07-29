import { object, string, TypeOf } from 'zod';

export const joinSlackChannelSchema = object({
    body: object({
        channel: string({
            required_error: "Channel name required!"
        }),
    })
})



export type JoinSlackChannelInput = TypeOf<typeof joinSlackChannelSchema>['body'];