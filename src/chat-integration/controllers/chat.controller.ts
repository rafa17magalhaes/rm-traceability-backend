import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ChatDTO } from '../dtos/chat.dto';
import { ChatIntegrationService } from '../services/chat-integration.service';
import { UserPayload } from 'src/auth/types/ExpressUserRequest';

@Controller('chat-integration')
@UseGuards(AuthGuard('jwt'))
export class ChatIntegrationController {
  constructor(private readonly chatService: ChatIntegrationService) {}

  @Post()
  async sendMessage(@Body() dto: ChatDTO, @Req() req: Request) {
    const user = req.user as UserPayload;
    const userId = user?.id;
    const companyId = user?.companyId;

    // 3) Monta o JSON que será enviado ao microserviço
    const bodyToMicroservice = {
      message: dto.message,
      user_id: userId,
      company_id: companyId,
    };

    const data = await this.chatService.getChatResponse(bodyToMicroservice);
    return data;
  }
}
