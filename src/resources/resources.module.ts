import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { ResourcesService } from './services/resources.service';
import { ResourcesController } from './controllers/resources.controller';
import { ResourceRepository } from './repositories/resource.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  providers: [
    ResourcesService,
    {
      provide: 'ResourceRepository',
      useFactory: (dataSource: DataSource) => {
        return new ResourceRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  controllers: [ResourcesController],
  exports: [ResourcesService],
})
export class ResourcesModule {}
