import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/companies/companies.module';
import { UsersModule } from 'src/users/users.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { StatusModule } from 'src/status/status.module';
import { EventModule } from 'src/events/events.module';
import { CodeModule } from 'src/codes/codes.module';
import { OrchestrationController } from './controllers/orchestration.controller';

@Module({
  imports: [
    CompaniesModule,
    UsersModule,
    ResourcesModule,
    StatusModule,
    EventModule,
    CodeModule,
  ],
  controllers: [OrchestrationController],
})
export class OrchestrationModule {}
