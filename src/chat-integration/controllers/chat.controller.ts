/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { ChatDTO } from '../dtos/chat.dto';
import { ChatIntegrationService } from '../services/chat-integration.service';

@Controller('chat-integration')
export class ChatIntegrationController {
  constructor(private readonly chatService: ChatIntegrationService) {}

  @Post()
  async sendMessage(@Body() dto: ChatDTO) {
    const data = await this.chatService.getChatResponse(dto);
    return data;
  }
}
