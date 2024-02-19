import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../../database/database.service';
import { ErrorCodes } from '../handlers/error/error-codes';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async verifyToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async createPasswordResetToken(user: User) {
    const profile = await this.prismaService.profile.findUnique({
      where: { userId: user.id },
    });

    // Profile bulunamazsa hata fırlat
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    const passwordResetExpiresIn = this.configService.get<string>(
      'PASSWORD_RESET_EXPIRES_IN',
    );

    return this.jwtService.sign(
      { email: profile.email, id: user.id, type: 'passwordReset' },
      { secret, expiresIn: passwordResetExpiresIn },
    );
  }

  async createAccessToken(user: User) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  async createRefreshToken(user: User) {
    const profile = await this.prismaService.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const payload = { email: profile.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async updateRefreshToken(user: User, token: string) {
    await this.prismaService.profile.update({
      where: { userId: user.id },
      data: { refreshToken: token },
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    let userEmail;
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      userEmail = decoded.email;
    } catch (error) {
      throw new UnauthorizedException(ErrorCodes.InvalidToken);
    }

    const profile = await this.prismaService.profile.findUnique({
      where: { email: userEmail },
      include: {
        user: true, // User modelini de dahil et
      },
    });

    if (!profile || profile.refreshToken !== refreshToken) {
      throw new UnauthorizedException(ErrorCodes.InvalidToken);
    }

    return this.createAccessToken(profile.user);
  }

  // async blacklistToken(token: string): Promise<void> {
  //   const decodedToken = this.jwtService.decode(token) as any;
  //   const expiresAt = new Date(decodedToken.exp * 1000);
  //   await this.prismaService.blacklistedToken.create({
  //     data: { token, expiresAt },
  //   });
  // }
}
