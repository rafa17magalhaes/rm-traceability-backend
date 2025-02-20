import { Injectable, Inject } from '@nestjs/common';
import { Code } from '../entities/code.entity';
import { CodeRepositoryType } from '../interfaces/code-repository.type';
import { CreateCodeDTO } from '../dtos/create-code.dto';
import { BulkGenerateCodesDTO } from '../dtos/bulk-generate-codes.dto';
import * as QRCode from 'qrcode';

import * as crypto from 'crypto';

@Injectable()
export class CodeService {
  constructor(
    @Inject('CodeRepository')
    private readonly codeRepository: CodeRepositoryType,
  ) {}

  async create(dto: CreateCodeDTO): Promise<Code> {
    if (!dto.qrCodeUrl && dto.value) {
      dto.qrCodeUrl = await this.generateQrCodeUrl(dto.value);
    }
    const code = this.codeRepository.create(dto);
    return this.codeRepository.save(code);
  }

  // Retorna todos os códigos
  async findAll(): Promise<Code[]> {
    return this.codeRepository.find();
  }
    /**
   * Método auxiliar para gerar uma string aleatória com prefixo
   */
    private generateCodeValue(prefix: string): string {
      const usedPrefix = (prefix || 'RM7');
      
      const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      const neededHex = randomHex.slice(0, 7);
    
      return `${usedPrefix}${neededHex}`;
    }     
  /**
   * Gera códigos em lote
   */
  async bulkGenerateCodes(dto: BulkGenerateCodesDTO): Promise<Code[]> {
    const { quantity, prefix } = dto;
    const generatedCodes: Code[] = [];

    for (let i = 0; i < quantity; i++) {
      const codeValue = this.generateCodeValue(prefix || 'RM7');

      const createDto: CreateCodeDTO = {
        value: codeValue,
        statusId: '2caca2b1-78dd-4ed9-a940-2cd72e91053c',
      };

      // Gera a url do QR code
      createDto.qrCodeUrl = await this.generateQrCodeUrl(codeValue);

      const codeEntity = this.codeRepository.create(createDto);
      generatedCodes.push(codeEntity);
    }

    // Salva todos de uma vez só (melhor performance que 1 a 1)
    return this.codeRepository.save(generatedCodes);
  }
  /**
   * Gera a imagem do QR code e converte para DataURL (outra opção: gerar e subir em S3)
   */
  private async generateQrCodeUrl(codeValue: string): Promise<string> {
    // Gera um DataURL (ex: 'data:image/png;base64,iVBOR...')
    return QRCode.toDataURL(codeValue);
  }
}
