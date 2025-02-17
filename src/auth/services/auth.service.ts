import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Método chamado pela LocalStrategy
async validateUser(email: string, password: string): Promise<any> {
  const user = await this.usersService.findByEmail(email);
  if (user && await user.checkPassword(password)) {
    return user;
  }
  return null;
}

async login(user: User) {
  const payload = { sub: user.id, companyId: user.companyId };
  return {
    accessToken: this.jwtService.sign(payload),
  };
 }
}
