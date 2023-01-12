import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

import { User } from './users/user.entity';
import { Account } from './accounts/account.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [User, Account, Transaction],
      synchronize: true,
    }),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
