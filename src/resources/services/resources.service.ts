import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
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

  async create(dto: CreateResourceDTO & { companyId: string }): Promise<Resource> {
    const { name, description, imageUrl, companyId } = dto;

    // Verifica se já existe um recurso com o mesmo nome para a mesma empresa
    const existingResource = await this.resourceRepository.findOne({ where: { name, companyId } });
    if (existingResource) {
      throw new ConflictException(`O recurso com o nome "${name}" já está cadastrado para esta empresa.`);
    }

    const resource = this.resourceRepository.create({
      name,
      description,
      active: true,
      imageUrl,
      companyId,
    });
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
  
    if (dto.active !== undefined) {
      if (typeof dto.active === 'string') {
        resource.active = dto.active.toLowerCase() === 'true';
      } else {
        resource.active = dto.active;
      }
    }
    if (dto.name !== undefined) {
      resource.name = dto.name;
    }
    if (dto.description !== undefined) {
      resource.description = dto.description;
    }
    if (dto.imageUrl !== undefined) {
      resource.imageUrl = dto.imageUrl;
    }
    
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
