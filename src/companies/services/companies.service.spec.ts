import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CompanyRepository } from '../repositories/company.repository';
import { NotFoundException } from '@nestjs/common';
import { Company } from '../entities/company.entity';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repositoryMock: jest.Mocked<CompanyRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: CompanyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repositoryMock = module.get<CompanyRepository>(
      CompanyRepository,
    ) as jest.Mocked<CompanyRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar uma nova empresa', async () => {
      repositoryMock.create.mockReturnValue({ id: 'uuid-1' } as Company);
      repositoryMock.save.mockResolvedValue({ id: 'uuid-1' } as Company);

      const result = await service.create({
        code: '001',
        document: '123456789',
        name: 'Empresa Teste',
        trade: 'Teste',
      });

      expect(repositoryMock.create).toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalled();
      expect(result.id).toBe('uuid-1');
    });
  });

  describe('findOne', () => {
    it('deve retornar a empresa se encontrada', async () => {
      const company = { id: 'uuid-1' } as Company;
      repositoryMock.findOne.mockResolvedValue(company);

      const result = await service.findOne('uuid-1');
      expect(result).toBe(company);
    });

    it('deve disparar NotFoundException se não encontrar', async () => {
      repositoryMock.findOne.mockResolvedValue(undefined);

      await expect(service.findOne('invalido')).rejects.toThrow(NotFoundException);
    });
  });
});
