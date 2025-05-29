import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatIntegrationService {
  constructor(private readonly http: HttpService) {}

  async getChatResponse(body: any): Promise<any> {
    const microServiceUrl =
      process.env.CHAT_MICRO_URL || 'http://chat-microservice:8000/chat/';

    try {
      const response$ = this.http.post(microServiceUrl, body);
      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      console.error(
        '[ChatIntegrationService] Erro ao chamar microserviço de chat:',
        error?.message,
      );
      throw error;
    }
  }
}
