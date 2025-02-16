import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Resource } from '../entities/resource.entity';
import { CreateResourceDTO } from '../dtos/create-resource.dto';
import { UpdateResourceDTO } from '../dtos/update-resource.dto';
import { ResourceRepository } from '../repositories/resource.repository';

@Injectable()
export class ResourcesService {
  constructor(
    @Inject('ResourceRepository')
    private readonly resourceRepository: ResourceRepository,
  ) {}

  async create(dto: CreateResourceDTO): Promise<Resource> {
    const resource = this.resourceRepository.create(dto);
    return this.resourceRepository.save(resource);
  }

  async findAll(): Promise<Resource[]> {
    return this.resourceRepository.find();
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource com ID ${id} não encontrado`);
    }
    return resource;
  }

  async update(id: string, dto: UpdateResourceDTO): Promise<Resource> {
    const resource = await this.findOne(id);
    Object.assign(resource, dto);
    return this.resourceRepository.save(resource);
  }

  async remove(id: string): Promise<void> {
    const result = await this.resourceRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Resource com ID ${id} não encontrado`);
    }
  }

  async findActive(): Promise<Resource[]> {
    return this.resourceRepository.findActiveResources();
  }
}
