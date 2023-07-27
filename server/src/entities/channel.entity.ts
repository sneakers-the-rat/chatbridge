import { Entity, Column, Index, ManyToOne, OneToOne } from 'typeorm';
import Model from './model.entity';
import { Bridge } from "./bridge.entity";
import { Group } from "./group.entity";

@Entity('channels')
export class Channel extends Model {
    @Column()
    name: string;

    @ManyToOne(() => Bridge, (bridge) => bridge.channels,
{
          eager: true
        }
    )
    bridge: Bridge

    @ManyToOne(() => Group, (group) => group.channels,
{
          eager: true
        }
    )
    group: Group

}

