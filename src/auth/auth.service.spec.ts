import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

const userTestPassword = 'testPassword';
const token = 'tokenTest';
const userTest = new User({
  id: "0",
  username: 'test',
  password: bcrypt.hashSync(userTestPassword, bcrypt.genSaltSync(10)),
  accountId: new Account({ id: '0', balance: '50.00' })
})

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn().mockResolvedValue(userTest),
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn((..._a) => token)
          }
        }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('Login', () => {
    it('should return a valid token', async () => {
      const result = await authService.login(userTest);

      expect(result.token).toEqual(token);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should return a error', () => {
      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error());

      expect(authService.login(userTest)).rejects.toThrowError();
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      const result = await authService.validateUser(userTest.username, userTestPassword);

      expect(result).toEqual(userTest);
      expect(usersService.findOneByUsername).toHaveBeenCalledTimes(1);
    });

    it('should return a error', () => {
      jest.spyOn(authService, 'validateUser').mockRejectedValueOnce(new Error());

      expect(authService.validateUser(userTest.username, userTestPassword)).rejects.toThrowError();
    });
  });
});
