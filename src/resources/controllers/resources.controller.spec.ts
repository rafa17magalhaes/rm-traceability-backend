import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from '../services/resources.service';
import { Resource } from '../entities/resource.entity';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let serviceMock: jest.Mocked<ResourcesService>;

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<ResourcesService>> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        {
          provide: ResourcesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    serviceMock = module.get<ResourcesService>(ResourcesService) as jest.Mocked<ResourcesService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o service.create com DTO e retornar o recurso criado', async () => {
      const dto = { name: 'Resource Teste', description: 'Desc', companyId: 'company-123' };
      const resourceMock = { id: 'uuid-1', ...dto } as Resource;

      serviceMock.create.mockResolvedValue(resourceMock);

      const result = await controller.create(dto);
      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(resourceMock);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de resources', async () => {
      const listMock = [{ id: '1' }, { id: '2' }] as Resource[];
      serviceMock.findAll.mockResolvedValue(listMock);

      const result = await controller.findAll();
      expect(serviceMock.findAll).toHaveBeenCalled();
      expect(result).toBe(listMock);
    });
  });
});
