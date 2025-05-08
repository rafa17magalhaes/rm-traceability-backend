/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CodeService } from '../services/code.service';
import { Code } from '../entities/code.entity';
import { CreateCodeDTO } from '../dtos/create-code.dto';
import { BulkGenerateCodesDTO } from '../dtos/bulk-generate-codes.dto';
import { Request } from 'express';
import { UserPayload } from 'src/auth/types/ExpressUserRequest';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';
import { QueryParams } from 'src/shared/query/GenericQueryList';
import { ChangeCodeStatusDTO } from 'src/events/dtos/change-code-status.dto';

@Controller('codes')
@UseGuards(AuthGuard('jwt'))
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  create(@Body() dto: CreateCodeDTO): Promise<Code> {
    return this.codeService.create(dto);
  }

  @Get()
  async findAll(@Query() query: QueryParams): Promise<PaginationDTO<Code>> {
    const convertedQuery: Partial<{
      page: number;
      search: string;
      sort: string;
      size: number;
    }> = {
      page: query.page ? Number(query.page) : 1,
      search: query.search || '',
      sort: query.sort || '',
      size: query.size ? Number(query.size) : 20,
    };
    return this.codeService.findAll(convertedQuery);
  }

  @Get('inventory')
  async findInventoryCodes(
    @Query() query: QueryParams,
    @Req() req: Request,
  ): Promise<PaginationDTO<Code>> {
    const user = req.user as UserPayload;
    const companyId = user?.companyId;
    if (!companyId) {
      throw new NotFoundException('ERRO: Código não possui companyId');
    }
    const convertedQuery: Partial<{
      page: number;
      search: string;
      sort: string;
      size: number;
    }> = {
      page: query.page ? Number(query.page) : 1,
      search: query.search || '',
      sort: query.sort || '',
      size: query.size ? Number(query.size) : 20,
    };
    return this.codeService.findInventoryCodes(companyId, convertedQuery);
  }

  @Post('bulk-generate')
  bulkGenerate(
    @Body() dto: BulkGenerateCodesDTO,
    @Req() req: Request,
  ): Promise<Code[]> {
    const user = req.user as UserPayload;
    const companyId = user?.companyId;
    return this.codeService.bulkGenerateCodes({ ...dto, companyId });
  }

  @Patch(':id/move')
  async changeStatus(
    @Param('id') codeId: string,
    @Body() dto: ChangeCodeStatusDTO,
    @Req() req: Request,
  ) {
    const user = req.user as UserPayload;
    const effectiveUserId = dto.userId?.trim() ? dto.userId : user.id;

    return this.codeService.changeCodeStatus(
      codeId,
      dto.statusId,
      dto.observation,
      effectiveUserId,
      dto.resourceId,
      user.companyId,
      dto.longitude,
      dto.latitude,
    );
  }
}
