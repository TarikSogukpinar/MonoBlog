import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { ErrorCodes } from 'src/core/handlers/error/error-codes';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { TokenService } from 'src/core/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUserService(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    try {
      const existingProfile = await this.prismaService.profile.findUnique({
        where: { email: registerUserDto.email },
      });

      if (existingProfile) {
        throw new ConflictException(ErrorCodes.UserAlreadyExists);
      }

      const hashedPassword = await this.hashingService.hashPassword(
        registerUserDto.password,
      );

      const newProfile = await this.prismaService.profile.create({
        data: {
          username: registerUserDto.username,
          email: registerUserDto.email,
          password: hashedPassword,
          user: {
            create: {},
          },
        },
      });

      return {
        id: newProfile.id,
        email: newProfile.email,
        role: newProfile.role,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async loginUserService(
    loginUserDto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    try {
      const user = await this.validateUserService(loginUserDto);
      const accessToken = await this.tokenService.createAccessToken(user);
      const refreshToken = await this.tokenService.createRefreshToken(user);
      await this.tokenService.updateRefreshToken(user, refreshToken);

      return {
        accessToken,
        refreshToken,
        // email: user.profile.email,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  private async findUserByEmailService(email: string): Promise<User | null> {
    const profile = await this.prismaService.profile.findUnique({
      where: { email },
      include: {
        user: true,
      },
    });

    return profile?.user || null;
  }

  private async validateUserService(loginUserDto: LoginUserDto): Promise<User> {
    const profile = await this.prismaService.profile.findUnique({
      where: { email: loginUserDto.email },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(ErrorCodes.UserNotFound);
    }

    const isPasswordValid = await this.hashingService.comparePassword(
      loginUserDto.password,
      profile.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException(ErrorCodes.InvalidCredentials);
    }

    return profile.user;
  }
}
