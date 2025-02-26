import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepositoryType } from '../interfaces/user-repository.type';

describe('UsersService', () => {
  let service: UsersService;
  let repoMock: jest.Mocked<UserRepositoryType>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      findActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repoMock = module.get<UserRepositoryType>(
      'UserRepository',
    ) as jest.Mocked<UserRepositoryType>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve lançar ConflictException se o e-mail já existir', async () => {
      repoMock.findOne.mockResolvedValue({
        id: 'uuid-1',
        email: 'teste@teste.com',
      } as User);

      await expect(
        service.create({
          name: 'Teste',
          email: 'teste@teste.com',
          password: '123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('deve criar usuário se e-mail ainda não existir', async () => {
      repoMock.findOne.mockResolvedValue(null);
      repoMock.create.mockReturnValue({ id: 'uuid-2' } as User);
      repoMock.save.mockResolvedValue({ id: 'uuid-2' } as User);

      const result = await service.create({
        name: 'Novo',
        email: 'novo@teste.com',
        password: '123',
      });
      expect(repoMock.findOne).toHaveBeenCalled();
      expect(repoMock.create).toHaveBeenCalled();
      expect(repoMock.save).toHaveBeenCalled();
      expect(result.id).toBe('uuid-2');
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se não encontrar', async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
