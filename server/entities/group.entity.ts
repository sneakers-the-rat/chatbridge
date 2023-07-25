import { Entity, Column, Index, OneToMany } from 'typeorm';
import Model from './model.entity';
import { Channel } from "./channel.entity";

@Entity('groups')
export class Group extends Model {
    @Column({
        unique: true
    })
    name: string;

    @Column({
        default: true
    })
    enable: boolean;

    @OneToMany(() => Channel, (channel) => channel.bridge)
    channels: Channel[]

}