import { ConnectionOptions } from 'typeorm';

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'blogapi',
  password: '123',
  database: 'blogapi',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: false,
  migrations: [__dirname + '/../migrations/**/*[.ts,.js]'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
console.log(ormConfig.migrations, 'migrations');
console.log(ormConfig.entities, 'entities');
