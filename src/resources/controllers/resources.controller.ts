import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { Resource } from '../entities/resource.entity';
import { CreateResourceDTO } from '../dtos/create-resource.dto';
import { UpdateResourceDTO } from '../dtos/update-resource.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ExpressUserRequest,
  UserPayload,
} from 'src/auth/types/ExpressUserRequest';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/aws/aws-s3.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Criar um novo recurso com imagem' })
  @ApiResponse({
    status: 201,
    description: 'Recurso criado com sucesso.',
    type: Resource,
  })
  async create(
    @Body() dto: CreateResourceDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: ExpressUserRequest,
  ): Promise<Resource> {
    const user = request.user as UserPayload;
    const companyId = user.companyId;
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.awsS3Service.uploadFile(file);
    }
    return this.resourcesService.create({ ...dto, companyId, imageUrl });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os recursos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recursos.',
    type: [Resource],
  })
  findAll(): Promise<Resource[]> {
    return this.resourcesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar recursos ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recursos ativos.',
    type: [Resource],
  })
  findActive(): Promise<Resource[]> {
    return this.resourcesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um recurso por ID' })
  @ApiResponse({
    status: 200,
    description: 'Recurso encontrado.',
    type: Resource,
  })
  findOne(@Param('id') id: string): Promise<Resource> {
    return this.resourcesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Atualizar um recurso existente' })
  @ApiResponse({
    status: 200,
    description: 'Recurso atualizado com sucesso.',
    type: Resource,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Resource> {
    let imageUrl: string | undefined;

    // Se o usuário anexar um novo arquivo, faz upload e atualiza a URL
    if (file) {
      imageUrl = await this.awsS3Service.uploadFile(file);
    }
    return this.resourcesService.update(id, { ...dto, imageUrl });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um recurso existente' })
  @ApiResponse({ status: 200, description: 'Recurso deletado com sucesso.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.resourcesService.remove(id);
  }
}
