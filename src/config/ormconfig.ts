import { ConnectionOptions } from 'typeorm';

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'blogapi',
  password: '123',
  database: 'blogapi',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // logging: true,
  synchronize: false,
  migrations: [__dirname + '/../migrations/**/*[.ts,.js]'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
export default ormConfig;
