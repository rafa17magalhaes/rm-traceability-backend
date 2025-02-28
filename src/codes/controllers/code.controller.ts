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
  @Post('bulk-generate')
  bulkGenerate(
    @Body() dto: BulkGenerateCodesDTO,
    @Req() req: Request,
  ): Promise<Code[]> {
    const user = req.user as UserPayload;
    const companyId = user?.companyId; // Capturamos o companyId do usuário logado
    // Acrescentamos companyId ao DTO e repassamos para o serviço
    return this.codeService.bulkGenerateCodes({ ...dto, companyId });
  }

  @Patch(':id/move')
  async changeStatus(
    @Param('id') codeId: string,
    @Body()
    body: { statusId: string; observation?: string; resourceId?: string },
    @Req() req: Request,
  ): Promise<Code> {
    const user = req.user as UserPayload;
    const userId = user?.id;
    const userCompanyId = user?.companyId;
    return this.codeService.changeCodeStatus(
      codeId,
      body.statusId,
      body.observation,
      userId,
      body.resourceId,
      userCompanyId,
    );
  }
}
