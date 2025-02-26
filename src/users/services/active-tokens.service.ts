import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { isAfter } from 'date-fns';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { ActiveToken } from '../entities/active-token.entity';
import { ActiveTokenRepositoryType } from '../interfaces/active-token-repository.type';

@Injectable()
export class ActiveTokensService {
  constructor(
    @Inject('ActiveTokenRepository')
    private activeTokenRepository: ActiveTokenRepositoryType,
    private readonly usersService: UsersService,
  ) {}

  async resendToken(userId: string): Promise<ActiveToken> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.active) {
      throw new BadRequestException(
        'Cannot resend token to an inactive or nonexisting user',
      );
    }
    const token = await this.activeTokenRepository.createToken(userId);
    return token;
  }

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

    const user = token.user;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.active) {
      throw new BadRequestException('User is already active');
    }

    user.active = true;
    user.password = newPassword;
    await this.usersService.update(user.id, user);

    await this.activeTokenRepository.markAsUsed(token);

    return user;
  }
}
