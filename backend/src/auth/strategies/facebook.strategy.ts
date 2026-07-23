import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.getOrThrow<string>('FACEBOOK_APP_SECRET'),
      callbackURL: `${configService.getOrThrow<string>('API_URL')}/auth/facebook/callback`,
      scope: ['email'],
      profileFields: ['id', 'emails', 'displayName'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    const { id, emails, displayName } = profile;
    const user = await this.authService.validateOAuthUser({
      provider: 'facebook',
      providerId: id,
      email: emails[0].value,
      name: displayName,
    });
    return user;
  }
}
