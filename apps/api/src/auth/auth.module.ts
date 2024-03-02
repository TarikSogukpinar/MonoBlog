import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/database/database.service';
import { TokenService } from 'src/core/token/token.service';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HashingModule } from 'src/utils/hashing/hashing.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        //added config
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    HashingModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    TokenService,
    HashingService,
    ConfigService,
  ],
})
export class AuthModule {}
