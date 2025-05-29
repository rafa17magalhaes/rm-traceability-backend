import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let serviceMock: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    serviceMock = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o service.create com DTO e companyId do request e retornar o usuário', async () => {
      // 1) Prepara o DTO sem companyId para usar o fallback do request
      const dto: CreateUserDTO = {
        name: 'Teste',
        email: 'teste@teste.com',
        password: 'senha123',
        phone: '767676675',
      };
      // 2) Mock do request com user.companyId
      const fakeReq: any = {
        user: { companyId: 'company-abc' },
      };
      // 3) Stub de retorno do service
      const userStub: User = {
        id: 'uuid-1',
        name: dto.name,
        email: dto.email,
        password: dto.password,
        companyId: 'company-abc',
      } as User;

      serviceMock.create.mockResolvedValue(userStub);

      // 4) Executa passando os dois argumentos
      const result = await controller.create(dto, fakeReq);

      // 5) Verifica chamada correta e resultado
      expect(serviceMock.create).toHaveBeenCalledWith(dto, 'company-abc');
      expect(result).toEqual(userStub);
    });

    it('deve usar companyId do DTO se fornecido', async () => {
      const dto: CreateUserDTO = {
        name: 'Teste2',
        email: 'outro@teste.com',
        password: 'senha456',
        companyId: 'company-xyz',
        phone: '767676675',
      };
      const fakeReq: any = {
        user: { companyId: 'company-abc' },
      };
      const userStub: User = {
        id: 'uuid-2',
        ...dto,
      } as User;

      serviceMock.create.mockResolvedValue(userStub);
      const result = await controller.create(dto, fakeReq);

      // Deve priorizar o companyId passado no DTO
      expect(serviceMock.create).toHaveBeenCalledWith(dto, 'company-xyz');
      expect(result).toEqual(userStub);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll e retornar todos os usuários', async () => {
      const users: User[] = [
        { id: 'u1', name: 'A', email: 'a@a.com' } as User,
        { id: 'u2', name: 'B', email: 'b@b.com' } as User,
      ];
      serviceMock.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(serviceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('deve chamar service.findOne com o id e retornar o usuário', async () => {
      const user: User = { id: 'u1', name: 'A', email: 'a@a.com' } as User;
      serviceMock.findOne.mockResolvedValue(user);

      const result = await controller.findOne('u1');
      expect(serviceMock.findOne).toHaveBeenCalledWith('u1');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('deve chamar service.update com id e DTO e retornar o usuário atualizado', async () => {
      const dto: UpdateUserDTO = { name: 'Novo Nome' };
      const updated: User = {
        id: 'u1',
        name: 'Novo Nome',
        email: 'a@a.com',
      } as User;
      serviceMock.update.mockResolvedValue(updated);

      const result = await controller.update('u1', dto);
      expect(serviceMock.update).toHaveBeenCalledWith('u1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('deve chamar service.remove com o id', async () => {
      serviceMock.remove.mockResolvedValue(undefined);
      await controller.remove('u1');
      expect(serviceMock.remove).toHaveBeenCalledWith('u1');
    });
  });
});
