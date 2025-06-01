import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ChatIntegrationController } from './controllers/chat.controller';
import { ChatIntegrationService } from './services/chat-integration.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ChatIntegrationService],
  controllers: [ChatIntegrationController],
  exports: [ChatIntegrationService],
})
export class ChatIntegrationModule {}
