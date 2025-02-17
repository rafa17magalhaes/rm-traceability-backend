import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

async validate(payload: any) {
  const user = await this.usersService.findOne(payload.sub);
  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  return { ...user, companyId: payload.companyId };
  }
}
