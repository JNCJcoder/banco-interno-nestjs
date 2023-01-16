import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';
import { UnauthorizedException } from '@nestjs/common';

const transactionsList: Transaction[] = [
  new Transaction({ value: '50.00' }),
  new Transaction({ value: '60.00' }),
  new Transaction({ value: '70.00' }),
];

const body: any = {
  debitedUsername: 'test',
  creditedUsername: 'test2',
  value: '50.00',
};

const user1 = new User({
  id: '0',
  username: 'test',
  accountId: new Account({ balance: '100.00' }),
});
const user2 = new User({
  id: '0',
  username: 'test2',
  accountId: new Account({ balance: '100.00' }),
});

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionsRepository: Repository<Transaction>;
  let accountsService: AccountsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(transactionsList[0]),
            find: jest.fn().mockResolvedValue(transactionsList),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    accountsService = module.get<AccountsService>(AccountsService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
    expect(accountsService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(transactionsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValueOnce(user1);
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValueOnce(user2);

      const result = await transactionsService.create('test', body);

      expect(result).toEqual(transactionsList[0]);
      expect(usersService.findOneByUsername).toHaveBeenCalledTimes(2);
      expect(accountsService.update).toHaveBeenCalledTimes(2);
      expect(transactionsRepository.create).toHaveBeenCalledTimes(1);
      expect(transactionsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a UnauthorizedException', async () => {
      jest
        .spyOn(transactionsService, 'create')
        .mockRejectedValueOnce(new UnauthorizedException());

      expect(transactionsService.create('test', body)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('findAll', () => {
    it('should list all account transactions', async () => {
      const result = await transactionsService.findAll('0');

      expect(result).toEqual(transactionsList);
      expect(transactionsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw a Error', () => {
      jest
        .spyOn(transactionsService, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(transactionsService.findAll('0')).rejects.toThrowError();
    });
  });
});
