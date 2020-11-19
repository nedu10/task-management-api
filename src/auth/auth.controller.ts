import {
  Body,
  Controller,
  Get,
  Req,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCreadentialsDto } from './dto/auth-credentials.dto';
import { Request } from 'express';
import { GetUser } from './decorators/get_user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @Get('/test')
  //   @UseGuards(AuthGuard())
  //   test(@Req() req: Request) {
  //     console.log(req);
  //   }

  //custom decorator
  @Get('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  register(@Body() authCredentialsDto: AuthCreadentialsDto): Promise<object> {
    return this.authService.register(authCredentialsDto);
  }
  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() authCredentialsDto: AuthCreadentialsDto): Promise<object> {
    return this.authService.login(authCredentialsDto);
  }
}
