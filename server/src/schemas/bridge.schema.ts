import { object, string, TypeOf } from 'zod';

export const updateBridgeSchema = object({
    body: object({
        Label: string({
            required_error: "Label for bridge required to update bridge"
        })
    })
})

export type UpdateBridgeInput = TypeOf<typeof updateBridgeSchema>['body'];