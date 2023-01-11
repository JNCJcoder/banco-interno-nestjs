import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) { }

  async create() {
    const account = this.accountsRepository.create({
      balance: '100.00',
    });

    return await this.accountsRepository.save(account);
  }

  async findOne(id: string) {
    try {
      return await this.accountsRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, balance: string) {
    const data = { balance };
    const account = await this.findOne(id);
    this.accountsRepository.merge(account, data);

    return await this.accountsRepository.save(account);
  }
}
