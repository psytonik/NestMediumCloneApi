import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule, UserModule],
})
export class AppModule {}
