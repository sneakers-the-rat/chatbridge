import { object, string, TypeOf } from 'zod';

export const checkAdminSchema = object({
    body: object({
        token: string({
            required_error: "Administration token required to log in!"
        })
    })
})



export type CheckAdminInput = TypeOf<typeof checkAdminSchema>['body'];