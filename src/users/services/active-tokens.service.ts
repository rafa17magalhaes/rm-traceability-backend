import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ActiveTokenRepository } from '../repositories/active-token.repository';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { ActiveToken } from '../entities/active-token.entity';
import { isAfter } from 'date-fns';

@Injectable()
export class ActiveTokensService {
  constructor(
    @Inject(ActiveTokenRepository)
    private activeTokenRepository: ActiveTokenRepository,

    private readonly usersService: UsersService,
    // Ex: para validar o usuário, setar user ativo, etc.
  ) {}

  /**
   * Exemplo de "resend token": gera novo token e retorna pro cliente
   */
  async resendToken(userId: string): Promise<ActiveToken> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.active) {
      throw new BadRequestException(
        `Cannot resend token to an inactive or nonexisting user`,
      );
    }
    // Cria um novo token
    const token = await this.activeTokenRepository.createToken(userId);
    return token;
  }

  /**
   * Ativa o usuário vinculado a esse token
   */
  async activateUser(code: string, newPassword: string): Promise<User> {
    // Busca token válido
    const token = await this.activeTokenRepository.findByCode(code);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    if (token.used) {
      throw new BadRequestException('Token already used');
    }
    if (isAfter(new Date(), token.expires)) {
      throw new BadRequestException('Token expired');
    }

    // Busca o usuário vinculado
    const user = token.user;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.active) {
      throw new BadRequestException('User is already active');
    }

    // Poderia haver outras checagens aqui (limite de usuários, company etc.)

    // Ativa e define a nova senha
    user.active = true;
    user.password = newPassword;
    await this.usersService.update(user.id, user);
    // (ou crie um método específico "activateUser" no UsersService)

    // Marca token como usado
    await this.activeTokenRepository.markAsUsed(token);

    return user;
  }
}
