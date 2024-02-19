import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({ status: 200, description: 'Successful register' })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const result = await this.authService.registerUserService(registerUserDto);
    return {
      message: 'Successfully register user!',
      result,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authService.loginUserService(loginUserDto);
    return {
      message: 'Successfully login user!',
      result,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, description: 'Successful logout' })
  @ApiBody({ type: LogoutDto })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: CustomRequest) {
    const userId = req.user?.id;
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!userId) {
      throw new UnauthorizedException(ErrorCodes.InvalidCredentials);
    }
    const result = await this.authService.logoutUserService(userId, token);
    return { message: 'Logout successful', result };
  }
}
