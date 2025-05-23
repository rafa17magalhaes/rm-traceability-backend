import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Status } from '../entities/status.entity';
import { CreateStatusDTO } from '../dtos/create-status.dto';
import { UpdateStatusDTO } from '../dtos/update-status.dto';
import { StatusRepositoryType } from '../interfaces/status-repository.type';

@Injectable()
export class StatusService {
  constructor(
    @Inject('StatusRepository')
    private readonly statusRepository: StatusRepositoryType,
  ) {}

  async create(createStatusDto: CreateStatusDTO): Promise<Status> {
    if (!createStatusDto.companyId || createStatusDto.companyId.trim() === '') {
      throw new ConflictException('companyId é obrigatório');
    }
    // Verifica duplicidade para a mesma empresa
    const existing = await this.statusRepository.findOne({
      where: {
        name: createStatusDto.name,
        companyId: createStatusDto.companyId,
      },
    });
    if (existing) {
      throw new ConflictException(
        `Status "${createStatusDto.name}" já existe para essa empresa.`,
      );
    }
    const status = this.statusRepository.create(createStatusDto);
    return this.statusRepository.save(status);
  }

  async findAll(): Promise<Status[]> {
    return this.statusRepository.find();
  }

  async findActive(): Promise<Status[]> {
    return this.statusRepository.findActiveStatuses();
  }

  async findOne(id: string): Promise<Status> {
    const status = await this.statusRepository.findOne({ where: { id } });
    if (!status) {
      throw new NotFoundException(`Status com ID "${id}" não encontrado`);
    }
    return status;
  }

  async findByName(name: string, companyId?: string): Promise<Status> {
    const status = await this.statusRepository.findOne({
      where: { name, companyId },
    });
    if (!status) {
      throw new NotFoundException(`Status "${name}" não encontrado.`);
    }
    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDTO): Promise<Status> {
    const status = await this.findOne(id);
    Object.assign(status, updateStatusDto);
    return this.statusRepository.save(status);
  }

  async remove(id: string): Promise<void> {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
  }
}
