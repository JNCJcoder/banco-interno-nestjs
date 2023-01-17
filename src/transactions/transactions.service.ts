import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

import * as Currency from 'currency.js';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransactionDto } from './dto/createTransaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) { }

  async create(username: string, body: CreateTransactionDto) {
    if (username != body.debitedUsername) {
      throw new UnauthorizedException(
        'Você só pode enviar dinheiro da sua conta.',
      );
    }

    if (body.debitedUsername == body.creditedUsername) {
      throw new UnauthorizedException(
        'Você não pode mandar dinheiro para si mesmo.',
      );
    }
    const debitedUser = await this.usersService.findOneByUsername(
      body.debitedUsername,
    );
    const creditedUserFound = await this.usersService.findOneByUsername(
      body.creditedUsername,
    );
    if (body.creditedUsername != creditedUserFound?.username) {
      throw new UnauthorizedException('O Usuario creditado não existe.');
    }

    if (Currency(debitedUser.accountId.balance).intValue === 0) {
      throw new UnauthorizedException('Você não possui dinheiro disponivel.');
    }

    if (
      Currency(debitedUser.accountId.balance).intValue <
      Currency(body.value).intValue
    ) {
      throw new UnauthorizedException(
        'Você não pode mandar mais dinheiro do que possui.',
      );
    }

    const debitedUserBalance = Currency(debitedUser.accountId.balance)
      .subtract(Currency(body.value))
      .toString();

    const creditedUserBalance = Currency(creditedUserFound.accountId.balance)
      .add(Currency(body.value))
      .toString();

    this.accountsService.update(debitedUser.accountId.id, debitedUserBalance);
    this.accountsService.update(
      creditedUserFound.accountId.id,
      creditedUserBalance,
    );

    const transaction = this.transactionsRepository.create({
      debitedAccountId: debitedUser.accountId,
      creditedAccountId: creditedUserFound.accountId,
      value: body.value,
    });

    return await this.transactionsRepository.save(transaction);
  }

  async findAll(accountId: string) {
    return await this.transactionsRepository.find({
      where: [
        { creditedAccountId: { id: accountId } },
        { debitedAccountId: { id: accountId } },
      ],
      relations: { creditedAccountId: true, debitedAccountId: true },
    });
  }
}
