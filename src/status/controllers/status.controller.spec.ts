/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from '../services/status.service';
import { Status } from '../entities/status.entity';
import { CreateStatusDTO } from '../dtos/create-status.dto';
import { UpdateStatusDTO } from '../dtos/update-status.dto';

describe('StatusController', () => {
  let controller: StatusController;
  let serviceMock: jest.Mocked<StatusService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findActive: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    serviceMock = module.get<StatusService>(StatusService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create - deve chamar o service e retornar o resultado', async () => {
    const dto: CreateStatusDTO = {
      name: 'Teste',
      description: 'Descrição de teste',
      companyId: 'comp1',
      active: true,
    };
    const fakeReq: any = { user: { companyId: 'comp1' } };
    const statusStub: any = {
      id: 'uuid-1',
      userId: 'user-1',
      ...dto,
      resource: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    serviceMock.create.mockResolvedValue(statusStub);
    const result = await controller.create(dto, fakeReq);

    // Agora espera um único objeto contendo dto + companyId
    expect(serviceMock.create).toHaveBeenCalledWith({
      ...dto,
      companyId: 'comp1',
    });
    expect(result.id).toBe('uuid-1');
  });

  it('findAll - deve chamar o service e retornar lista', async () => {
    const list: Status[] = [
      {
        id: '1',
        name: 'S1',
        description: '',
        companyId: 'c1',
        active: true,
        resource: undefined,
        userId: 'u1',
      } as any,
      {
        id: '2',
        name: 'S2',
        description: '',
        companyId: 'c2',
        active: false,
        resource: undefined,
        userId: 'u2',
      } as any,
    ];

    serviceMock.findAll.mockResolvedValue(list);
    const result = await controller.findAll();

    expect(serviceMock.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('findActive - deve chamar o service e retornar apenas status ativos', async () => {
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

    serviceMock.findActive.mockResolvedValue(statuses);
    const result = await controller.findActive();

    expect(serviceMock.findActive).toHaveBeenCalled();
    expect(result.every((s) => s.active)).toBe(true);
  });

  it('findOne - deve chamar o service e retornar um status', async () => {
    const status: Status = {
      id: 'uuid-1',
      name: 'Status 1',
      description: 'Desc 1',
      companyId: 'comp1',
      active: true,
      resource: undefined,
    } as Status;

    serviceMock.findOne.mockResolvedValue(status);
    const result = await controller.findOne('uuid-1');

    expect(serviceMock.findOne).toHaveBeenCalledWith('uuid-1');
    expect(result.id).toBe('uuid-1');
  });

  it('update - deve chamar o service e retornar o status atualizado', async () => {
    const updateDto: UpdateStatusDTO = { name: 'Status Atualizado' };
    const status: Status = {
      id: 'uuid-1',
      name: 'Status Atualizado',
      description: 'Desc 1',
      companyId: 'comp1',
      active: true,
      resource: undefined,
    } as Status;

    serviceMock.update.mockResolvedValue(status);
    const result = await controller.update('uuid-1', updateDto);

    expect(serviceMock.update).toHaveBeenCalledWith('uuid-1', updateDto);
    expect(result.name).toBe('Status Atualizado');
  });

  it('remove - deve chamar o service para remover o status', async () => {
    serviceMock.remove.mockResolvedValue(undefined);
    await controller.remove('uuid-1');

    expect(serviceMock.remove).toHaveBeenCalledWith('uuid-1');
  });
});
