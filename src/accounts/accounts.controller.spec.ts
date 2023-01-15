import { Test, TestingModule } from '@nestjs/testing';
import { Account } from './account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

const account = new Account({ id: '0', balance: '50.00' });

describe('AccountsController', () => {
  let accountsController: AccountsController;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(account),
          },
        },
      ],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(accountsController).toBeDefined();
    expect(accountsService).toBeDefined();
  });

  describe('balance', () => {
    it('should return account balance', async () => {
      const result = await accountsController.findOne({ accountId: '0' });

      expect(result).toEqual(account);
      expect(accountsService.findOne).toHaveBeenCalledTimes(1);
      expect(accountsService.findOne).toHaveBeenCalledWith('0');
    });

    it('should throw a Error', async () => {
      jest
        .spyOn(accountsController, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(
        accountsController.findOne({ accountId: '0' }),
      ).rejects.toThrowError();
    });
  });
});
