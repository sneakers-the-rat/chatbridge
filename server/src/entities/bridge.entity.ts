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

    // Used to fetch the bridge data from the client while installing
    @Column()
    state_token: string;

    // Bot token for slack
    @Column({
        unique: true
    })
    Token: string;

    @Column({
        default: true
    })
    PrefixMessagesWithNick: boolean;

    // See https://github.com/42wim/matterbridge/wiki/Settings#prefixmessageswithnick
    @Column({
        default: "[{LABEL}] <{NICK}> "
    })
    RemoteNickFormat: string;

    // Bridged channels (not the channels in the slack/discord/etc.)
    @OneToMany(() => Channel, (channel) => channel.bridge,
      {
          cascade: ["remove"]
      })
    channels: Channel[]

}

@ChildEntity()
export class SlackBridge extends Bridge {
    // The ID of the team
    @Column({nullable:true})
    team_id: string;

    @Column({nullable:true})
    team_name: string;

    @Column({
        nullable: true
    })
    user_token: string;

    @Column({
        nullable:true
    })
    bot_id: string;

}

@ChildEntity()
export class DiscordBridge extends Bridge {
    // Server name - needed to use multiple 'servers' with a single discord app
    @Column()
    Server: string;

    // Analogous to team_id in slack bridge
    @Column()
    guild_id: string;
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
