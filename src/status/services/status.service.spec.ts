/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Status } from '../entities/status.entity';
import { StatusRepositoryType } from '../interfaces/status-repository.type';
import { CreateStatusDTO } from '../dtos/create-status.dto';
import { UpdateStatusDTO } from '../dtos/update-status.dto';

describe('StatusService', () => {
  let service: StatusService;
  let repoMock: jest.Mocked<StatusRepositoryType>;

  beforeEach(async () => {
    const mockRepo: Partial<jest.Mocked<StatusRepositoryType>> = {
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
    repoMock = module.get('StatusRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve lançar conflito se companyId vazio', async () => {
      const dto = { name: 'X', description: '', companyId: '', active: true };
      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar conflito se já existir status com mesmo nome e empresa', async () => {
      const dto: CreateStatusDTO = {
        name: 'Teste',
        description: 'Desc',
        companyId: 'c1',
        active: true,
      };
      repoMock.findOne.mockResolvedValue({} as Status);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('deve criar um status com sucesso', async () => {
      const dto: CreateStatusDTO = {
        name: 'Teste',
        description: 'Desc',
        companyId: 'c1',
        active: true,
      };
      const statusStub = {
        id: 'uuid-1',
        ...dto,
        resource: undefined,
      } as unknown as Status;

      repoMock.create.mockReturnValue(statusStub);
      repoMock.save.mockResolvedValue(statusStub);

      const result = await service.create(dto);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(statusStub);
      expect(result.id).toBe('uuid-1');
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os status', async () => {
      const list: Status[] = [
        {
          id: '1',
          name: 'A',
          description: '',
          companyId: 'c1',
          active: true,
          resource: undefined,
        } as Status,
        {
          id: '2',
          name: 'B',
          description: '',
          companyId: 'c2',
          active: false,
          resource: undefined,
        } as Status,
      ];
      repoMock.find.mockResolvedValue(list);
      const result = await service.findAll();
      expect(repoMock.find).toHaveBeenCalled();
      expect(result).toEqual(list);
    });
  });

  describe('findActive', () => {
    it('deve retornar somente status ativos', async () => {
      const activeList: Status[] = [
        {
          id: '1',
          name: 'A',
          description: '',
          companyId: 'c1',
          active: true,
          resource: undefined,
        } as Status,
      ];
      repoMock.findActiveStatuses.mockResolvedValue(activeList);
      const result = await service.findActive();
      expect(repoMock.findActiveStatuses).toHaveBeenCalled();
      expect(result.every((s) => s.active)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se não encontrar', async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar um status se encontrado', async () => {
      const statusStub: Status = {
        id: 'uuid-1',
        name: 'S1',
        description: 'Desc',
        companyId: 'c1',
        active: true,
        resource: undefined,
      } as Status;
      repoMock.findOne.mockResolvedValue(statusStub);

      const result = await service.findOne('uuid-1');
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result).toEqual(statusStub);
    });
  });

  describe('findByName', () => {
    it('deve lançar NotFoundException se não existir', async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(service.findByName('X')).rejects.toThrow(NotFoundException);
    });

    it('deve retornar status válido', async () => {
      const statusStub: Status = {
        id: 'u1',
        name: 'X',
        description: '',
        companyId: 'c1',
        active: true,
        resource: undefined,
      } as Status;
      repoMock.findOne.mockResolvedValue(statusStub);
      const result = await service.findByName('X', 'c1');
      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { name: 'X', companyId: 'c1' },
      });
      expect(result).toEqual(statusStub);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o status atualizado', async () => {
      const updateDto: UpdateStatusDTO = { name: 'New Name' };
      const original: Status = {
        id: 'u1',
        name: 'Old',
        description: 'D',
        companyId: 'c1',
        active: true,
        resource: undefined,
      } as Status;

      // findOne retorna o original
      repoMock.findOne.mockResolvedValue(original);
      // e save retorna o merged
      const updatedStatus = { ...original, ...updateDto } as unknown as Status;
      repoMock.save.mockResolvedValue(updatedStatus);

      const result = await service.update('u1', updateDto);
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(repoMock.save).toHaveBeenCalledWith(original);
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('deve remover sem erro', async () => {
      const stub: Status = {
        id: 'u1',
        name: 'X',
        description: '',
        companyId: 'c1',
        active: true,
        resource: undefined,
      } as Status;
      repoMock.findOne.mockResolvedValue(stub);
      repoMock.remove.mockResolvedValue(stub);

      await service.remove('u1');
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(repoMock.remove).toHaveBeenCalledWith(stub);
    });
  });
});
