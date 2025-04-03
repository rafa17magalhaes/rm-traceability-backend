/* eslint-disable prettier/prettier */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ChatDTO } from '../dtos/chat.dto';
import { ChatResponseDTO } from '../dtos/chat.response.dto';

@Injectable()
export class ChatIntegrationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Faz requisição ao micro serviço de Chat (FastAPI).
   * Recebe um objeto do tipo ChatDTO contendo message e sessionId.
   */
  async getChatResponse(chat: ChatDTO): Promise<ChatResponseDTO> {
    const baseUrl =
      this.configService.get<string>('CHAT_MICROSERVICE_URL') ||
      'http://localhost:8000';
    let url = `${baseUrl}/chat`;

    if (chat.sessionId) {
      url += `?session_id=${chat.sessionId}`;
    }

    try {
      const response: AxiosResponse<ChatResponseDTO> = await lastValueFrom(
        this.httpService.post<ChatResponseDTO>(url, { message: chat.message }),
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Erro ao chamar micro serviço: ${error.message}`,
        500,
      );
    }
  }
}
