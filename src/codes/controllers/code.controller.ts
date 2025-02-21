import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { CodeService } from '../services/code.service';
import { Code } from '../entities/code.entity';
import { CreateCodeDTO } from '../dtos/create-code.dto';
import { BulkGenerateCodesDTO } from '../dtos/bulk-generate-codes.dto';
import { Request } from 'express';

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

  @Patch(':id/move')
  changeStatus(
    @Param('id') codeId: string,
    @Body() body: { statusId: string; observation?: string },
    @Req() req: Request,
  ): Promise<Code> {
    const userId = (req.user as any)?.id || 'usuário-simulacao';
    return this.codeService.changeCodeStatus(
      codeId,
      body.statusId,
      body.observation,
      userId,
    );
  }}
