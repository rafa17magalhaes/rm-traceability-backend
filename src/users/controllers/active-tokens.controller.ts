import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ActiveTokensService } from '../services/active-tokens.service';

@Controller('users/activate')
export class ActiveTokensController {
  constructor(private readonly activeTokensService: ActiveTokensService) {}

  @Post('resend')
  async resend(@Body() body: { userId: string }) {
    const token = await this.activeTokensService.resendToken(body.userId);
    return { message: 'Token resent', token: token.code };
  }

  @Patch()
  async activate(@Body() body: { code: string; password: string }) {
    const user = await this.activeTokensService.activateUser(
      body.code,
      body.password,
    );
    return { message: 'User activated successfully', user };
  }
}
