import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventRepositoryType } from '../interfaces/event-repository.type';
import { Event } from '../entities/event.entity';
import { CreateEventDTO } from '../dtos/create-event.dto';

describe('EventService', () => {
  let service: EventService;
  let repoMock: jest.Mocked<EventRepositoryType>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findByCodeId: jest.fn(),
      findByStatusId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: 'EventRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repoMock = module.get<EventRepositoryType>(
      'EventRepository',
    ) as jest.Mocked<EventRepositoryType>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event successfully', async () => {
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

      repoMock.create.mockReturnValue(event);
      repoMock.save.mockResolvedValue(event);

      const result = await service.create(dto);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(event);
      expect(result.id).toEqual('uuid-1');
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
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
      repoMock.find.mockResolvedValue(events);
      const result = await service.findAll();
      expect(repoMock.find).toHaveBeenCalled();
      expect(result).toEqual(events);
    });
  });

  describe('findByCodeId', () => {
    it('should return events matching the given codeId', async () => {
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
      repoMock.findByCodeId.mockResolvedValue(events);
      const result = await service.findByCodeId('code-1');
      expect(repoMock.findByCodeId).toHaveBeenCalledWith('code-1');
      expect(result).toEqual(events);
    });
  });

  describe('findByStatusId', () => {
    it('should return events matching the given statusId', async () => {
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
      repoMock.findByStatusId.mockResolvedValue(events);
      const result = await service.findByStatusId('status-1');
      expect(repoMock.findByStatusId).toHaveBeenCalledWith('status-1');
      expect(result).toEqual(events);
    });
  });
});
