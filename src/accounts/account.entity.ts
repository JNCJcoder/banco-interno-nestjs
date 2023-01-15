import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

import * as Currency from 'currency.js';

const currencyTransformer: ValueTransformer = {
  from: (value: string) => Currency(value).toString(),
  to: (value: string) => Currency(value).toString(),
};

@Entity({ name: 'Account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ transformer: currencyTransformer })
  balance?: string;

  constructor(account: Partial<Account>) {
    this.id = account?.id;
    this.balance = account?.balance;
  }
}
