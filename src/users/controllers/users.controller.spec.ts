// src/users/controllers/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
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
    serviceMock = module.get<UsersService>(UsersService) as jest.Mocked<UsersService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create - deve chamar o service e retornar o resultado', async () => {
    const dto = { name: 'Teste', email: 'teste@teste.com', password: '123' };
    const user = { id: 'uuid-1', ...dto } as User;

    serviceMock.create.mockResolvedValue(user);
    const result = await controller.create(dto);

    expect(serviceMock.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('uuid-1');
  });
});
