import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from '../services/event.service';
import { CreateEventDTO } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';
import { QueryParams } from 'src/shared/query/GenericQueryList';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';

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
    serviceMock = module.get<EventService>(EventService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created event', async () => {
      const dto: CreateEventDTO = {
        statusId: 'status-1',
        codeId: 'code-1',
        valueCode: 'v1',
        ip: '127.0.0.1',
        companyId: 'company-1',
        urlCode: 'url-code-1',
        observation: 'Test observation',
        longitude: 1.23,
        latitude: 4.56,
        resourceId: 'resource-1',
        userId: 'user-1',
      };

      const eventStub: Event = {
        id: 'uuid-1',
        ...dto,
        creationDate: new Date(),
        updatedAt: new Date(),
        isRead: false,
      } as unknown as Event;

      serviceMock.create.mockResolvedValue(eventStub);
      const result = await controller.create(dto);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(eventStub);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return a PaginationDTO of events', async () => {
      const query: QueryParams = {
        page: '2',
        size: '5',
        search: 'foo',
        sort: 'createdAt:DESC',
      };
      const events: Event[] = [
        {
          id: 'e1',
          statusId: 's1',
          codeId: 'c1',
          valueCode: 'v1',
          ip: 'ip',
          companyId: 'co1',
          urlCode: 'u1',
          observation: 'o',
          longitude: 0,
          latitude: 0,
          resourceId: 'r1',
          userId: 'u1',
          creationDate: new Date(),
          updatedAt: new Date(),
          isRead: false,
        } as unknown as Event,
      ];
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
        size: 5,
        search: 'foo',
        sort: 'createdAt:DESC',
      });
      expect(result).toEqual(paginated);
    });
  });

  describe('findByCodeId', () => {
    it('should call service.findByCodeId and return an array of events', async () => {
      const events: Event[] = [
        {
          id: 'uuid-1',
          statusId: 'status-1',
          codeId: 'code-1',
          valueCode: 'v1',
          ip: '127.0.0.1',
          companyId: 'company-1',
          urlCode: 'url-code-1',
          observation: 'Test observation',
          longitude: 1.23,
          latitude: 4.56,
          resourceId: 'resource-1',
          userId: 'user-1',
          creationDate: new Date(),
          updatedAt: new Date(),
          isRead: false,
        } as unknown as Event,
      ];

      serviceMock.findByCodeId.mockResolvedValue(events);
      const result = await controller.findByCodeId('code-1');

      expect(serviceMock.findByCodeId).toHaveBeenCalledWith('code-1');
      expect(result).toEqual(events);
    });
  });

  describe('findByStatusId', () => {
    it('should call service.findByStatusId and return an array of events', async () => {
      const events: Event[] = [
        {
          id: 'uuid-2',
          statusId: 'status-2',
          codeId: 'code-2',
          valueCode: 'v2',
          ip: '127.0.0.2',
          companyId: 'company-2',
          urlCode: 'url-code-2',
          observation: 'Obs 2',
          longitude: 2.34,
          latitude: 5.67,
          resourceId: 'resource-2',
          userId: 'user-2',
          creationDate: new Date(),
          updatedAt: new Date(),
          isRead: true,
        } as unknown as Event,
      ];

      serviceMock.findByStatusId.mockResolvedValue(events);
      const result = await controller.findByStatusId('status-2');

      expect(serviceMock.findByStatusId).toHaveBeenCalledWith('status-2');
      expect(result).toEqual(events);
    });
  });

  describe('getUnreadCount', () => {
    it('should call service.getUnreadCount and return the count object', async () => {
      serviceMock.getUnreadCount.mockResolvedValue(7);
      const result = await controller.getUnreadCount();

      expect(serviceMock.getUnreadCount).toHaveBeenCalled();
      expect(result).toEqual({ count: 7 });
    });
  });

  describe('markAsRead', () => {
    it('should call service.markAsRead and return the updated event', async () => {
      const eventStub: Event = {
        id: 'uuid-read',
        statusId: 's1',
        codeId: 'c1',
        valueCode: 'v1',
        ip: 'ip',
        companyId: 'co1',
        urlCode: 'u1',
        observation: 'o',
        longitude: 0,
        latitude: 0,
        resourceId: 'r1',
        userId: 'u1',
        creationDate: new Date(),
        updatedAt: new Date(),
        isRead: true,
      } as unknown as Event;

      serviceMock.markAsRead.mockResolvedValue(eventStub);
      const result = await controller.markAsRead('uuid-read');

      expect(serviceMock.markAsRead).toHaveBeenCalledWith('uuid-read');
      expect(result).toEqual(eventStub);
    });
  });
});
