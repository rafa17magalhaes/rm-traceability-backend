import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resources')
@Unique(['name', 'companyId'])
export class Resource {
  @ApiProperty({ example: 'uuid-1234', description: 'ID único do recurso' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Recurso 1', description: 'Nome do recurso' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Descrição do recurso',
    description: 'Descrição do recurso',
  })
  @Column()
  description: string;

  @ApiProperty({ example: true, description: 'Status do recurso' })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({ example: 'company-123', description: 'ID da empresa' })
  @Column({ name: 'company_id' })
  companyId: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/bucket/imagename.jpg',
    description: 'URL da imagem do recurso',
  })
  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
