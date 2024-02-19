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
      const existingUser = await this.findUserByEmailService(
        registerUserDto.email,
      );

      if (existingUser) {
        throw new ConflictException(ErrorCodes.UserAlreadyExists);
      }

      const createNewUser = await this.prismaService.profile.create({
        data: {
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

  private async findUserByEmailService(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

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
