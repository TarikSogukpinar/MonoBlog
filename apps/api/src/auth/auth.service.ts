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
    private hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUserService(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    try {
      const existingUser = await this.findUserByEmailService(
        registerUserDto.email,
        registerUserDto.username,
      );

      if (existingUser) {
        throw new ConflictException(ErrorCodes.UserAlreadyExists);
      }

      const createNewUser = await this.prismaService.user.create({
        data: {
          username: registerUserDto.username,
          email: registerUserDto.email,
          password: await this.hashingService.hashPassword(
            registerUserDto.password,
          ),
        },
      });

      return {
        id: createNewUser.id,
        email: createNewUser.email,
        role: createNewUser.role,
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
      const users = await this.validateUserService(loginUserDto);
      const accessToken = await this.tokenService.createAccessToken(users);
      const refreshToken = await this.tokenService.createRefreshToken(users);
      await this.tokenService.updateRefreshToken(users, refreshToken);
      return {
        accessToken,
        refreshToken,
        email: users.email,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  // async logoutUserService(userId: number, token: string): Promise<void> {
  //   try {
  //     await this.prismaService.user.update({
  //       where: { id: userId },
  //       data: { refreshToken: null },
  //     });

  //     // await this.tokenService.blacklistToken(token);
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException(
  //       'An error occurred, please try again later',
  //     );
  //   }
  // }

  private async findUserByEmailService(
    username: string,
    email: string,
  ): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (user) throw new ConflictException(ErrorCodes.UserAlreadyExists);
    return user;
  }

  private async validateUserService(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException(ErrorCodes.UserNotFound);

    const isPasswordValid = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new NotFoundException(ErrorCodes.InvalidCredentials);

    return user;
  }
}
