import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

import { CreateUserDto } from './dto/createUser.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly accountsService: AccountsService,
  ) { }

  async create(createUser: CreateUserDto) {
    const account = await this.accountsService.create();
    const user = this.usersRepository.create({
      ...createUser,
      accountId: account,
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOneByUsername(username: string) {
    try {
      const user = await this.usersRepository.find({
        where: { username },
        relations: { accountId: true },
      });
      return user[0];
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
