import { Entity, Column, Index, OneToMany, TableInheritance, ChildEntity } from 'typeorm';
import Model from './model.entity';
import { Channel } from "./channel.entity";

export enum BridgeEnumType {
    SLACK = 'slack',
    DISCORD = 'discord',
    MATRIX = 'matrix'
}

@Entity('bridges')
@TableInheritance({column: { type: "varchar", name: "type" }})
export class Bridge extends Model {
    @Column({
        type: "enum",
        enum: BridgeEnumType
    })
    Protocol: string;

    @Column()
    Label: string;

    @Column({
        default: true
    })
    PrefixMessagesWithNick: boolean;

    // See https://github.com/42wim/matterbridge/wiki/Settings#prefixmessageswithnick
    @Column({
        default: "[{LABEL}] <{NICK}> "
    })
    RemoteNickFormat: string;

    @Column({
        unique: true
    })
    Token: string;

    @OneToMany(() => Channel, (channel) => channel.bridge)
    channels: Channel[]

}

@ChildEntity()
export class MatrixBridge extends Bridge {
    // Matrix-specific
    @Column()
    Server: string;

    @Column()
    Login: string;

    @Column()
    Password: string;
}