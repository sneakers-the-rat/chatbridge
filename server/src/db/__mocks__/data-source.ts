import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ":memory:",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  // migrations: ['src/migrations/**/*{.ts,.js}'],
  // subscribers: ['server/subscribers/**/*{.ts,.js}'],
});
