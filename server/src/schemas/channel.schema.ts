import { object, string, TypeOf } from 'zod';

export const createChannelSchema = object({
    body: object({
        invite_token: string({
            required_error: "Group invite token required to create channel!"
        }),
        bridge_id: string({
            required_error: "Bridge column ID required to create channel!"
        }),
        channel_name: string({
            required_error: "Channel name required to create channel!"
        })
    })
})

export type CreateChannelInput = TypeOf<typeof createChannelSchema>['body'];