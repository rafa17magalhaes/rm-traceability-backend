import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Code } from '../entities/code.entity';
import { CodeRepositoryType } from '../interfaces/code-repository.type';
import { CreateCodeDTO } from '../dtos/create-code.dto';
import { BulkGenerateCodesDTO } from '../dtos/bulk-generate-codes.dto';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { EventRepositoryType } from 'src/events/interfaces/event-repository.type';
import { StatusService } from 'src/status/services/status.service';
import { CreateEventDTO } from 'src/events/dtos/create-event.dto';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';
import SearchQuery from 'src/shared/query/SearchQuery';

@Injectable()
export class CodeService {
  constructor(
    @Inject('CodeRepository')
    private readonly codeRepository: CodeRepositoryType,

    @Inject('EventRepository')
    private readonly eventRepository: EventRepositoryType,

    @Inject(StatusService)
    private readonly statusService: StatusService,
  ) {}

  async create(dto: CreateCodeDTO): Promise<Code> {
    if (!dto.qrCodeUrl && dto.value) {
      dto.qrCodeUrl = await this.generateQrCodeUrl(dto.value);
    }
    const code = this.codeRepository.create(dto);
    return this.codeRepository.save(code);
  }

  async findInventoryCodes(
    companyId: string,
    queryParams: Partial<{
      page: number;
      search: string;
      sort: string;
      size: number;
    }>,
  ): Promise<PaginationDTO<Code>> {
    const searchQuery = SearchQuery.build().from(queryParams);

    const qb = this.codeRepository
      .createQueryBuilder('code')
      .leftJoinAndSelect('code.status', 'status')
      .leftJoinAndSelect('code.company', 'company')
      .leftJoinAndSelect('code.resource', 'resource')
      .leftJoinAndSelect('code.user', 'user');

    // Filtra somente códigos que possuem resourceId definido
    qb.andWhere('code.resourceId IS NOT NULL');

    // Filtra para a mesma empresa do usuário logado
    qb.andWhere('code.companyId = :companyId', { companyId });

    // Aplica os filtros dinâmicos
    searchQuery.params.forEach((criteria, index) => {
      const paramName = `param${index}`;
      if (criteria.operator === ':') {
        qb.andWhere(`code.${criteria.key} = :${paramName}`, {
          [paramName]: criteria.value,
        });
      } else if (criteria.operator === '>') {
        qb.andWhere(`code.${criteria.key} > :${paramName}`, {
          [paramName]: criteria.value,
        });
      } else if (criteria.operator === '<') {
        qb.andWhere(`code.${criteria.key} < :${paramName}`, {
          [paramName]: criteria.value,
        });
      }
    });

    if (searchQuery.sort.length > 0) {
      searchQuery.sort.forEach((sortStr) => {
        const [key, order] = sortStr.split(':');
        qb.addOrderBy(`code.${key}`, order as 'ASC' | 'DESC');
      });
    } else {
      qb.addOrderBy('code.createdAt', 'DESC');
    }

    // Paginação
    qb.skip((searchQuery.page - 1) * searchQuery.size).take(searchQuery.size);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page: searchQuery.page,
      size: searchQuery.size,
    };
  }

  async findAll(
    queryParams: Partial<{
      page: number;
      search: string;
      sort: string;
      size: number;
    }>,
  ): Promise<PaginationDTO<Code>> {
    const searchQuery = SearchQuery.build().from(queryParams);
    const qb = this.codeRepository
      .createQueryBuilder('code')
      .leftJoinAndSelect('code.status', 'status')
      .leftJoinAndSelect('code.company', 'company')
      .leftJoinAndSelect('code.resource', 'resource')
      .leftJoinAndSelect('code.user', 'user');

    // Aplica filtros dinâmicos (exemplo simples para o operador "=")
    searchQuery.params.forEach((criteria, index) => {
      const paramName = `param${index}`;
      if (criteria.operator === ':') {
        qb.andWhere(`code.${criteria.key} = :${paramName}`, {
          [paramName]: criteria.value,
        });
      } else if (criteria.operator === '>') {
        qb.andWhere(`code.${criteria.key} > :${paramName}`, {
          [paramName]: criteria.value,
        });
      } else if (criteria.operator === '<') {
        qb.andWhere(`code.${criteria.key} < :${paramName}`, {
          [paramName]: criteria.value,
        });
      }
    });

    if (searchQuery.sort.length > 0) {
      searchQuery.sort.forEach((sortStr) => {
        const [key, order] = sortStr.split(':');
        qb.addOrderBy(`code.${key}`, order as 'ASC' | 'DESC');
      });
    } else {
      qb.addOrderBy('code.createdAt', 'DESC');
    }

    // Paginação
    qb.skip((searchQuery.page - 1) * searchQuery.size).take(searchQuery.size);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page: searchQuery.page, size: searchQuery.size };
  }

  /**
   * Altera o status de um código e registra um evento correspondente.
   */
  async changeCodeStatus(
    codeId: string,
    newStatusId: string,
    observation?: string,
    userId?: string,
    resourceId?: string,
    companyId?: string,
  ): Promise<Code> {
    const code = await this.codeRepository.findOne({ where: { id: codeId } });
    if (!code) {
      throw new NotFoundException(`Código não encontrado: ${codeId}`);
    }

    const sanitizedCompanyId =
      companyId && companyId.trim() !== '' ? companyId : undefined;
    const sanitizedResourceId =
      resourceId && resourceId.trim() !== '' ? resourceId : undefined;

    if (sanitizedCompanyId) {
      code.companyId = sanitizedCompanyId;
    }
    if (sanitizedResourceId) {
      code.resourceId = sanitizedResourceId;
    }

    const status = await this.statusService.findOne(newStatusId);
    if (!status) {
      throw new NotFoundException(`Status não encontrado: ${newStatusId}`);
    }

    const createEventDto: CreateEventDTO = {
      codeId: code.id,
      valueCode: code.value,
      statusId: newStatusId,
      observation: observation || undefined,
      userId: userId && userId.trim() !== '' ? userId : undefined,
      companyId: sanitizedCompanyId || code.companyId,
      resourceId: sanitizedResourceId,
    };

    const event = this.eventRepository.create(createEventDto);
    await this.eventRepository.save(event);

    code.statusId = newStatusId;
    code.currentObservation = observation || '';

    return this.codeRepository.save(code);
  }

  /**
   * Gera códigos em lote e registra um evento "Gerado" para cada código.
   */
  async bulkGenerateCodes(dto: BulkGenerateCodesDTO): Promise<Code[]> {
    const { quantity, prefix } = dto;
    const generatedCodes: Code[] = [];

    for (let i = 0; i < quantity; i++) {
      const codeValue = this.generateCodeValue(prefix || 'RM7');

      const createDto: CreateCodeDTO = {
        value: codeValue,
      };

      createDto.qrCodeUrl = await this.generateQrCodeUrl(codeValue);
      const codeEntity = this.codeRepository.create(createDto);
      // Salva o código criado
      const savedCode = await this.codeRepository.save(codeEntity);

      // Busca o status "Gerado" dinamicamente (pode filtrar também pelo companyId, se necessário)
      const statusGerado = await this.statusService.findByName(
        'Gerado',
        savedCode.companyId,
      );

      // Registra o evento "Gerado" e atualiza o status do código
      const updatedCode = await this.changeCodeStatus(
        savedCode.id,
        statusGerado.id,
        'Código gerado por lote',
      );
      generatedCodes.push(updatedCode);
    }

    return generatedCodes;
  }

  private generateCodeValue(prefix: string): string {
    const usedPrefix = prefix || 'RM7';
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const neededHex = randomHex.slice(0, 7);
    return `${usedPrefix}${neededHex}`;
  }

  private async generateQrCodeUrl(codeValue: string): Promise<string> {
    return QRCode.toDataURL(codeValue);
  }
}
