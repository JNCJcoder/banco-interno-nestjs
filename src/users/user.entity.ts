import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Account } from '../accounts/account.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn()
  accountId!: Account;

  @BeforeInsert()
  hashPassword() {
    const salt = bcrypt.genSaltSync(10) + process.env.PEPPER;
    this.password = bcrypt.hashSync(this.password, salt);
  }

  constructor(user: Partial<User>) {
    this.id = user?.id;
    this.username = user?.username;
    this.password = user?.password;
    this.accountId = user?.accountId;
  }
}
