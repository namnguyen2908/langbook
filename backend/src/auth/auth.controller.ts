import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpCode,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user as User,
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
    return res.redirect(
      `${this.configService.get<string>('FRONTEND_URL')}/auth/callback?token=${accessToken}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user as User,
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
    return res.redirect(
      `${this.configService.get<string>('FRONTEND_URL')}/auth/callback?token=${accessToken}`,
    );
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Req() req: Request) {
    const token = req.cookies?.refresh_token;
    return this.authService.refreshToken(token);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res() res: Response) {
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return res.json({ success: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string }) {
    const fullUser = await this.authService.getUserById(user.id);
    if (!fullUser) throw new UnauthorizedException();
    const { id, email, name, role, createdAt } = fullUser;
    return { id, email, name, role, createdAt };
  }
}
