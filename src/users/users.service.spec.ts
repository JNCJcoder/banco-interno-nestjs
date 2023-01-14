import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { NotFoundException } from '@nestjs/common';

const user = new User({
  id: '0',
  username: 'test',
  password: 'testPassword',
});

const userCreated = new User({
  username: 'new-user',
  password: 'testPassword',
});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(userCreated),
            save: jest.fn().mockResolvedValue(userCreated),
            findOneByOrFail: jest.fn().mockResolvedValue(user),
            find: jest.fn().mockResolvedValue([user]),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    accountsService = module.get<AccountsService>(AccountsService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(accountsService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const body: CreateUserDto = {
        username: 'new-user',
        password: 'testPassword',
      };

      const result = await usersService.create(body);

      expect(result).toEqual(userCreated);
      expect(accountsService.create).toBeCalledTimes(1);
      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('should throw a Error', async () => {
      const body: CreateUserDto = {
        username: 'new-user',
        password: 'testPassword',
      };

      jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error());

      expect(usersService.create(body)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a user successfully', async () => {
      const result = await usersService.findOne('0');

      expect(result).toEqual(user);
      expect(usersRepository.findOneByOrFail).toHaveBeenCalledWith({ id: '0' });
      expect(usersRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      expect(usersService.findOne('0')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user successfully', async () => {
      const result = await usersService.findOneByUsername('test');

      expect(result).toEqual(user);
      expect(usersRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', () => {
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockRejectedValueOnce(new NotFoundException());

      expect(usersService.findOneByUsername('test')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
