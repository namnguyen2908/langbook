import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateOAuthUser(data: {
    provider: 'google' | 'facebook';
    providerId: string;
    email: string;
    name: string;
  }): Promise<User> {
    const user = await this.usersService.findByProvider(
      data.provider,
      data.providerId,
    );
    if (user) return user;

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const role = data.email === adminEmail ? 'admin' : 'user';

    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      await this.usersService.updateProvider(
        existing.id,
        data.provider,
        data.providerId,
      );
      if (existing.role !== role) {
        await this.usersService.updateRole(existing.id, role);
      }
      return this.usersService.findById(existing.id) as Promise<User>;
    }

    return this.usersService.createOAuthUser({ ...data, role });
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }

  async getUserById(id: string) {
    return this.usersService.findById(id);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return {
        accessToken: this.jwtService.sign(
          { sub: user.id, email: user.email, role: user.role },
          { expiresIn: '15m' },
        ),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
