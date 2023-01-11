import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

import * as Currency from 'currency.js';

import { Account } from '../accounts/account.entity';

const currencyTransformer: ValueTransformer = {
  from: (value: string) => Currency(value).toString(),
  to: (value: string) => Currency(value).toString(),
};

@Entity({ name: 'Transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.id)
  @JoinColumn()
  debitedAccountId: Account;

  @ManyToOne(() => Account, (account) => account.id)
  @JoinColumn()
  creditedAccountId: Account;

  @Column({ transformer: currencyTransformer })
  value: string;

  @CreateDateColumn()
  createdAt: Date;
}
