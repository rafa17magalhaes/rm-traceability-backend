import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Code } from './entities/code.entity';
import { CodeRepository } from './repositories/code.repository';
import { CodeService } from './services/code.service';
import { CodeController } from './controllers/code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [CodeController],
  providers: [
    CodeService,
    {
      provide: 'CodeRepository',
      useFactory: (dataSource: DataSource) => {
        return new CodeRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [CodeService],
})
export class CodeModule {}
