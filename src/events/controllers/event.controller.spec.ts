import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from '../services/event.service';
import { Event } from '../entities/event.entity';
import { CreateEventDTO } from '../dtos/create-event.dto';

describe('EventController', () => {
  let controller: EventController;
  let serviceMock: jest.Mocked<EventService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByCodeId: jest.fn(),
      findByStatusId: jest.fn(),
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
    it('should call service.create and return the created event', async () => {
      const dto: CreateEventDTO = {
        statusId: 'status-1',
        codeId: 'code-1',
        ip: '127.0.0.1',
        companyId: 'company-1',
        urlCode: 'url-code-1',
        observation: 'Test observation',
        longitude: 1.23,
        latitude: 4.56,
        resourceId: 'resource-1',
        userId: 'user-1',
      };

      const event: Event = {
        id: 'uuid-1',
        ...dto,
        creationDate: new Date(),
        updatedAt: new Date(),
      } as Event;

      serviceMock.create.mockResolvedValue(event);
      const result = await controller.create(dto);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result.id).toEqual('uuid-1');
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of events', async () => {
      const events: Event[] = [
        {
          id: 'uuid-1',
          statusId: 'status-1',
          codeId: 'code-1',
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
        } as Event,
      ];
      serviceMock.findAll.mockResolvedValue(events);
      const result = await controller.findAll();

      expect(serviceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(events);
    });
  });

  describe('findByCodeId', () => {
    it('should call service.findByCodeId and return an array of events', async () => {
      const events: Event[] = [
        {
          id: 'uuid-1',
          statusId: 'status-1',
          codeId: 'code-1',
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
        } as Event,
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
          id: 'uuid-1',
          statusId: 'status-1',
          codeId: 'code-1',
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
        } as Event,
      ];
      serviceMock.findByStatusId.mockResolvedValue(events);
      const result = await controller.findByStatusId('status-1');

      expect(serviceMock.findByStatusId).toHaveBeenCalledWith('status-1');
      expect(result).toEqual(events);
    });
  });
});
