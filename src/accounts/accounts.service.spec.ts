import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';

const account = new Account({ id: '0', balance: '100.00' });

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let accountsRepository: Repository<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(account),
            findOneByOrFail: jest.fn().mockResolvedValue(account),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    accountsService = module.get<AccountsService>(AccountsService);
    accountsRepository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
  });

  it('should be defined', () => {
    expect(accountsService).toBeDefined();
    expect(accountsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a account successfully', async () => {
      const result = await accountsService.create();

      expect(result).toEqual(account);
      expect(accountsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw a error', async () => {
      jest.spyOn(accountsService, 'create').mockRejectedValueOnce(new Error());

      expect(accountsService.create()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a account', async () => {
      const result = await accountsService.findOne('0');

      expect(result).toEqual(account);
      expect(accountsRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(accountsRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: '0',
      });
    });

    it('should throw a Error', () => {
      jest
        .spyOn(accountsService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      expect(accountsService.findOne('0')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a account', async () => {
      const testAccount = new Account({ id: '0', balance: '50.00' });
      jest.spyOn(accountsRepository, 'save').mockResolvedValueOnce(testAccount);

      const result = await accountsService.update('0', '50.00');

      expect(result).toEqual(testAccount);
      expect(accountsRepository.merge).toHaveBeenCalledTimes(1);
      expect(accountsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a Error', () => {
      jest.spyOn(accountsService, 'update').mockRejectedValueOnce(new Error());

      expect(accountsService.update('0', '50.00')).rejects.toThrowError();
    });
  });
});
