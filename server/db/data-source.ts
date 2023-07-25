require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';

const postgresConfig = config.get<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}>('postgresConfig');

export const AppDataSource = new DataSource({
    ...postgresConfig,
    type: 'postgres',
    synchronize: true,
    logging: false,
    entities: ['server/entities/**/*.entity{.ts,.js}'],
    migrations: ['server/migrations/**/*{.ts,.js}'],
    // subscribers: ['server/subscribers/**/*{.ts,.js}'],
});
