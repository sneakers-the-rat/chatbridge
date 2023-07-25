import { object, string, TypeOf } from 'zod';

export const createGroupSchema = object({
    body: object({
        name: string({
            required_error: "Name for group required"
        }),
        token: string({
            required_error: "Administration token required for creating groups"
        })
    })
})

export const getGroupSchema = object({
    name: string({
        required_error: "Name of group required to get group"
    })
})

export type CreateGroupInput = TypeOf<typeof createGroupSchema>['body'];
export type GetGroupInput = TypeOf<typeof getGroupSchema>;