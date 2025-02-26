/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ActiveTokensService } from './active-tokens.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ActiveTokenRepositoryType } from '../interfaces/active-token-repository.type';

describe('ActiveTokensService', () => {
  let service: ActiveTokensService;
  let repoMock: jest.Mocked<ActiveTokenRepositoryType>;
  let usersServiceMock: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActiveTokensService,
        {
          provide: 'ActiveTokenRepository',
          useValue: {
            createToken: jest.fn(),
            findByCode: jest.fn(),
            markAsUsed: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ActiveTokensService>(ActiveTokensService);
    repoMock = module.get<ActiveTokenRepositoryType>(
      'ActiveTokenRepository',
    ) as jest.Mocked<ActiveTokenRepositoryType>;
    usersServiceMock = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resendToken', () => {
    it('deve lançar erro se usuário não encontrado ou inativo', async () => {
      usersServiceMock.findOne.mockResolvedValueOnce(null as any);
      await expect(service.resendToken('invalid-user')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
