import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Code } from './entities/code.entity';
import { CodeRepository } from './repositories/code.repository';
import { CodeService } from './services/code.service';
import { CodeController } from './controllers/code.controller';
import { EventModule } from 'src/events/events.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [TypeOrmModule.forFeature([Code]), EventModule, StatusModule],
  controllers: [CodeController],
  providers: [
    CodeService,
    {
      provide: 'CodeRepository',
      useFactory: (dataSource: DataSource) => new CodeRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [CodeService],
})
export class CodeModule {}
