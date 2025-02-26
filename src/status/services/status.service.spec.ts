import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { NotFoundException } from '@nestjs/common';
import { Status } from '../entities/status.entity';
import { StatusRepositoryType } from '../interfaces/status-repository.type';
import { CreateStatusDTO } from '../dtos/create-status.dto';
import { UpdateStatusDTO } from '../dtos/update-status.dto';

describe('StatusService', () => {
  let service: StatusService;
  let repoMock: jest.Mocked<StatusRepositoryType>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      findActiveStatuses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: 'StatusRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    repoMock = module.get<StatusRepositoryType>(
      'StatusRepository',
    ) as jest.Mocked<StatusRepositoryType>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um status com sucesso', async () => {
      const dto: CreateStatusDTO = {
        name: 'Teste',
        description: 'Desc de teste',
        companyId: 'comp1',
        active: true,
      };
      const status: Status = {
        id: 'uuid-1',
        ...dto,
        resource: undefined,
      } as Status;

      repoMock.create.mockReturnValue(status);
      repoMock.save.mockResolvedValue(status);

      const result = await service.create(dto);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(status);
      expect(result.id).toBe('uuid-1');
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os status', async () => {
      const statuses: Status[] = [
        {
          id: 'uuid-1',
          name: 'Status 1',
          description: 'Desc 1',
          companyId: 'comp1',
          active: true,
          resource: undefined,
        } as Status,
        {
          id: 'uuid-2',
          name: 'Status 2',
          description: 'Desc 2',
          companyId: 'comp2',
          active: false,
          resource: undefined,
        } as Status,
      ];
      repoMock.find.mockResolvedValue(statuses);

      const result = await service.findAll();
      expect(repoMock.find).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
  });

  describe('findActive', () => {
    it('deve retornar somente os status ativos', async () => {
      const statuses: Status[] = [
        {
          id: 'uuid-1',
          name: 'Status 1',
          description: 'Desc 1',
          companyId: 'comp1',
          active: true,
          resource: undefined,
        } as Status,
      ];
      repoMock.findActiveStatuses.mockResolvedValue(statuses);

      const result = await service.findActive();
      expect(repoMock.findActiveStatuses).toHaveBeenCalled();
      expect(result.every((s) => s.active)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se o status não for encontrado', async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar um status se encontrado', async () => {
      const status: Status = {
        id: 'uuid-1',
        name: 'Status 1',
        description: 'Desc 1',
        companyId: 'comp1',
        active: true,
        resource: undefined,
      } as Status;
      repoMock.findOne.mockResolvedValue(status);

      const result = await service.findOne('uuid-1');
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result.id).toBe('uuid-1');
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o status atualizado', async () => {
      const updateDto: UpdateStatusDTO = { name: 'Updated Name' };
      const status: Status = {
        id: 'uuid-1',
        name: 'Old Name',
        description: 'Desc',
        companyId: 'comp1',
        active: true,
        resource: undefined,
      } as Status;
      const updatedStatus: Status = { ...status, ...updateDto };

      repoMock.findOne.mockResolvedValue(status);
      repoMock.save.mockResolvedValue(updatedStatus);

      const result = await service.update('uuid-1', updateDto);
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(repoMock.save).toHaveBeenCalledWith(status);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('deve remover o status', async () => {
      const status: Status = {
        id: 'uuid-1',
        name: 'Status 1',
        description: 'Desc 1',
        companyId: 'comp1',
        active: true,
        resource: undefined,
      } as Status;
      repoMock.findOne.mockResolvedValue(status);
      repoMock.remove.mockResolvedValue(status);

      await service.remove('uuid-1');
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(repoMock.remove).toHaveBeenCalledWith(status);
    });
  });
});
