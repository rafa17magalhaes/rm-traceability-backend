import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../services/event.service';
import { CreateEventDTO } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';
import { QueryParams } from 'src/shared/query/GenericQueryList';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';
import { EventController } from '../controllers/event.controller';

describe('EventController', () => {
  let controller: EventController;
  let serviceMock: jest.Mocked<EventService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByCodeId: jest.fn(),
      findByStatusId: jest.fn(),
      getUnreadCount: jest.fn(),
      markAsRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    serviceMock = module.get<EventService>(
      EventService,
    ) as jest.Mocked<EventService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar service.create e retornar o event', async () => {
      const dto: CreateEventDTO = {
        statusId: 's1',
        codeId: 'c1',
        ip: '127.0.0.1',
        companyId: 'comp1',
        urlCode: 'url',
        observation: 'obs',
        longitude: 1,
        latitude: 2,
        resourceId: 'r1',
        userId: 'u1',
        valueCode: 'v1',
      };
      const eventStub: Event = {
        id: 'e1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isRead: false,
      } as Event;

      serviceMock.create.mockResolvedValue(eventStub);
      const result = await controller.create(dto);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(eventStub);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll e retornar pagina convertida', async () => {
      const query: QueryParams = {
        page: '2',
        size: '5',
        search: 'foo',
        sort: 'bar:DESC',
      };
      const events: Event[] = [{ id: 'e1' } as Event];
      const paginated: PaginationDTO<Event> = {
        data: events,
        total: 1,
        page: 2,
        size: 5,
      };

      serviceMock.findAll.mockResolvedValue(paginated);
      const result = await controller.findAll(query);

      expect(serviceMock.findAll).toHaveBeenCalledWith({
        page: 2,
        search: 'foo',
        sort: 'bar:DESC',
        size: 5,
      });
      expect(result).toBe(paginated);
    });
  });

  describe('findByCodeId', () => {
    it('deve chamar service.findByCodeId e retornar lista de eventos', async () => {
      const codeId = 'code-123';
      const events: Event[] = [{ id: 'e2' } as Event];

      serviceMock.findByCodeId.mockResolvedValue(events);
      const result = await controller.findByCodeId(codeId);

      expect(serviceMock.findByCodeId).toHaveBeenCalledWith(codeId);
      expect(result).toBe(events);
    });
  });

  describe('findByStatusId', () => {
    it('deve chamar service.findByStatusId e retornar lista de eventos', async () => {
      const statusId = 'status-456';
      const events: Event[] = [{ id: 'e3' } as Event];

      serviceMock.findByStatusId.mockResolvedValue(events);
      const result = await controller.findByStatusId(statusId);

      expect(serviceMock.findByStatusId).toHaveBeenCalledWith(statusId);
      expect(result).toBe(events);
    });
  });

  describe('getUnreadCount', () => {
    it('deve chamar service.getUnreadCount e retornar objeto { count }', async () => {
      serviceMock.getUnreadCount.mockResolvedValue(7);
      const result = await controller.getUnreadCount();

      expect(serviceMock.getUnreadCount).toHaveBeenCalled();
      expect(result).toEqual({ count: 7 });
    });
  });

  describe('markAsRead', () => {
    it('deve chamar service.markAsRead e retornar o evento atualizado', async () => {
      const event: Event = { id: 'e4', isRead: true } as Event;
      serviceMock.markAsRead.mockResolvedValue(event);

      const result = await controller.markAsRead('e4');

      expect(serviceMock.markAsRead).toHaveBeenCalledWith('e4');
      expect(result).toBe(event);
    });
  });
});
