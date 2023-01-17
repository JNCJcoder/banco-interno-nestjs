import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

const transactionsList: Transaction[] = [
  new Transaction({ value: '50.00' }),
  new Transaction({ value: '60.00' }),
  new Transaction({ value: '70.00' }),
];

const req: any = {
  user: {
    username: 'test',
    accountId: '0',
  },
};

const body: CreateTransactionDto = {
  debitedUsername: 'test',
  creditedUsername: 'test2',
  value: '50.00',
};

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(transactionsList[0]),
            findAll: jest.fn().mockResolvedValue(transactionsList),
          },
        },
      ],
    }).compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
    expect(transactionsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const result = await transactionsController.create(req, body);

      expect(result).toEqual(transactionsList[0]);
      expect(transactionsService.create).toHaveBeenCalledTimes(1);
      expect(transactionsService.create).toHaveBeenCalledWith(
        req.user.username,
        body,
      );
    });

    it('should throw a error', async () => {
      jest
        .spyOn(transactionsService, 'create')
        .mockRejectedValueOnce(new Error());

      expect(transactionsController.create(req, body)).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should list all account transactions', async () => {
      const result = await transactionsController.findAll(req);

      expect(result).toEqual(transactionsList);
      expect(transactionsService.findAll).toHaveBeenCalledTimes(1);
      expect(transactionsService.findAll).toHaveBeenCalledWith(
        req.user.accountId,
      );
    });

    it('should throw a Error', () => {
      jest
        .spyOn(transactionsService, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(transactionsController.findAll(req)).rejects.toThrowError();
    });
  });
});
