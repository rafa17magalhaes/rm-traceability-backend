import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Resource } from '../entities/resource.entity';
import { ResourceRepositoryType } from '../interfaces/resource-repository.type';
import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let repositoryMock: jest.Mocked<ResourceRepositoryType>;

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<ResourceRepositoryType>> = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      findActiveResources: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: 'ResourceRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    repositoryMock = module.get<ResourceRepositoryType>('ResourceRepository') as jest.Mocked<ResourceRepositoryType>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar um novo resource', async () => {
      // Simula comportamento do repositório
      repositoryMock.create.mockReturnValue({ id: 'uuid-1' } as Resource);
      repositoryMock.save.mockResolvedValue({ id: 'uuid-1' } as Resource);

      const result = await service.create({
        name: 'Resource Teste',
        description: 'Desc',
        companyId: 'company-123',
      });

      expect(repositoryMock.create).toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalled();
      expect(result.id).toBe('uuid-1');
    });
  });

  describe('findOne', () => {
    it('deve retornar o resource se encontrado', async () => {
      const resource = { id: 'uuid-1' } as Resource;
      repositoryMock.findOne.mockResolvedValue(resource);

      const result = await service.findOne('uuid-1');
      expect(result).toBe(resource);
    });

    it('deve disparar NotFoundException se não encontrar', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalido')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover o resource se existir', async () => {
      repositoryMock.delete.mockResolvedValue({ affected: 1 } as any);
      await service.remove('uuid-1');
      expect(repositoryMock.delete).toHaveBeenCalledWith('uuid-1');
    });

    it('deve disparar NotFoundException se não encontrar', async () => {
      repositoryMock.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove('invalido')).rejects.toThrow(NotFoundException);
    });
  });
});
