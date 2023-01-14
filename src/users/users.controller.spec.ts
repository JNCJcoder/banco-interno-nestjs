import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const user = new User({
  id: '0',
  username: 'test',
  password: 'testPassword',
});

const userCreated = new User({
  username: 'new-user',
  password: 'testPassword',
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(userCreated),
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const body: CreateUserDto = {
        username: 'new-user',
        password: 'testPassword',
      };

      const result = await usersController.create(body);

      expect(result).toEqual(userCreated);
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(usersService.create).toHaveBeenCalledWith(body);
    });

    it('should throw a Error', async () => {
      const body: CreateUserDto = {
        username: 'new-user',
        password: 'testPassword',
      };

      jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error());

      expect(usersController.create(body)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should get a user by ID', async () => {
      const result = await usersController.findOne('0');

      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(usersService.findOne).toHaveBeenCalledWith('0');
    });

    it('should throw a NotFoundException', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      expect(usersController.findOne('0')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
