import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { AccountsModule } from 'src/accounts/accounts.module';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
