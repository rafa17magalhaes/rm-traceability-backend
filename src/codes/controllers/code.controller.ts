import { Controller, Get, Post, Body } from '@nestjs/common';
import { CodeService } from '../services/code.service';
import { Code } from '../entities/code.entity';
import { CreateCodeDTO } from '../dtos/create-code.dto';
import { BulkGenerateCodesDTO } from '../dtos/bulk-generate-codes.dto';

@Controller('codes')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  create(@Body() dto: CreateCodeDTO): Promise<Code> {
    return this.codeService.create(dto);
  }

  @Get()
  findAll(): Promise<Code[]> {
    return this.codeService.findAll();
  }

  @Post('bulk-generate')
  bulkGenerate(@Body() dto: BulkGenerateCodesDTO): Promise<Code[]> {
    return this.codeService.bulkGenerateCodes(dto);
  }
}
