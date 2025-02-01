import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from '../services/companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let serviceMock: jest.Mocked<CompaniesService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    serviceMock = module.get<CompaniesService>(
      CompaniesService,
    ) as jest.Mocked<CompaniesService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create - deve chamar o service.create com DTO', async () => {
    const dto = { code: '001', name: 'Empresa Teste' } as any;
    serviceMock.create.mockResolvedValue({ id: 'uuid-1', ...dto });

    const result = await controller.create(dto);

    expect(serviceMock.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('uuid-1');
  });
});
