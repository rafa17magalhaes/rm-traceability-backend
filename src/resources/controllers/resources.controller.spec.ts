import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from '../services/resources.service';
import { Resource } from '../entities/resource.entity';
import { ExpressUserRequest } from 'src/auth/types/ExpressUserRequest';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { CreateResourceDTO } from '../dtos/create-resource.dto';
import { UpdateResourceDTO } from '../dtos/update-resource.dto';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let serviceMock: jest.Mocked<ResourcesService>;
  let s3Mock: jest.Mocked<AwsS3Service>;

  beforeEach(async () => {
    s3Mock = { uploadFile: jest.fn() } as any;
    serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findActive: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        { provide: ResourcesService, useValue: serviceMock },
        { provide: AwsS3Service, useValue: s3Mock },
      ],
    }).compile();

    controller = module.get(ResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    const dto: CreateResourceDTO = { name: 'R', description: 'D' } as any;
    const fakeReq = { user: { companyId: 'C1' } } as ExpressUserRequest;

    it('sem arquivo: imageUrl deve ser undefined', async () => {
      const saved: Resource = {
        id: 'u1',
        ...dto,
        companyId: 'C1',
        imageUrl: undefined,
      } as Resource;

      serviceMock.create.mockResolvedValue(saved);

      // dto, request, file
      const result = await controller.create(dto, fakeReq, undefined);

      expect(serviceMock.create).toHaveBeenCalledWith({
        ...dto,
        companyId: 'C1',
        imageUrl: undefined,
      });
      expect(result).toEqual(saved);
    });

    it('com arquivo: faz upload e passa imageUrl para service.create', async () => {
      const file = {} as Express.Multer.File;
      const url = 'https://s3/test.jpg';
      const saved: Resource = {
        id: 'u2',
        ...dto,
        companyId: 'C1',
        imageUrl: url,
      } as Resource;

      s3Mock.uploadFile.mockResolvedValueOnce(url);
      serviceMock.create.mockResolvedValue(saved);

      const result = await controller.create(dto, fakeReq, file);

      expect(s3Mock.uploadFile).toHaveBeenCalledWith(file);
      expect(serviceMock.create).toHaveBeenCalledWith({
        ...dto,
        companyId: 'C1',
        imageUrl: url,
      });
      expect(result).toEqual(saved);
    });
  });

  describe('update()', () => {
    const dto: UpdateResourceDTO = { description: 'New D' } as any;
    const fakeSaved: Resource = { id: 'u3', ...dto } as Resource;

    it('sem arquivo: imageUrl undefined', async () => {
      serviceMock.update.mockResolvedValue(fakeSaved);
      // id, dto, file
      const result = await controller.update('u3', dto, undefined);

      expect(serviceMock.update).toHaveBeenCalledWith('u3', {
        ...dto,
        imageUrl: undefined,
      });
      expect(result).toEqual(fakeSaved);
    });

    it('com arquivo: chama S3 e passa imageUrl', async () => {
      const file = {} as Express.Multer.File;
      const url = 'https://s3/updated.jpg';
      const saved: Resource = { id: 'u4', ...dto, imageUrl: url } as Resource;

      s3Mock.uploadFile.mockResolvedValueOnce(url);
      serviceMock.update.mockResolvedValue(saved);

      const result = await controller.update('u4', dto, file);

      expect(s3Mock.uploadFile).toHaveBeenCalledWith(file);
      expect(serviceMock.update).toHaveBeenCalledWith('u4', {
        ...dto,
        imageUrl: url,
      });
      expect(result).toEqual(saved);
    });
  });

  describe('findAll / findActive / findOne / remove', () => {
    it('findAll()', async () => {
      const arr = [{ id: '1' }] as Resource[];
      serviceMock.findAll.mockResolvedValue(arr);
      expect(await controller.findAll()).toEqual(arr);
      expect(serviceMock.findAll).toHaveBeenCalled();
    });

    it('findActive()', async () => {
      const arr = [{ id: '2' }] as Resource[];
      serviceMock.findActive.mockResolvedValue(arr);
      expect(await controller.findActive()).toEqual(arr);
      expect(serviceMock.findActive).toHaveBeenCalled();
    });

    it('findOne()', async () => {
      const item = { id: '3' } as Resource;
      serviceMock.findOne.mockResolvedValue(item);
      expect(await controller.findOne('3')).toEqual(item);
      expect(serviceMock.findOne).toHaveBeenCalledWith('3');
    });

    it('remove()', async () => {
      await controller.remove('4');
      expect(serviceMock.remove).toHaveBeenCalledWith('4');
    });
  });
});
