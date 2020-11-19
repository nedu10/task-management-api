import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCreadentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/jwt_payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCreadentialsDto): Promise<object> {
    try {
      await this.userRepository.createNew(authCredentialsDto);
      return {
        status_code: 201,
        status: 'success',
        message: 'User Successfully Registered',
      };
    } catch (error) {
      console.log('registration error >> ', error);
      return {
        status_code: 500,
        status: 'error',
        message: 'System Error',
        error,
      };
    }
  }

  async login(authCredentialsDto: AuthCreadentialsDto): Promise<object> {
    try {
      const username = await this.userRepository.validateUserPassword(
        authCredentialsDto,
      );
      if (!username) {
        return {
          status_code: 400,
          status: 'failed',
          message: 'Auth Failed',
          error: new UnauthorizedException('Invalid Credentials'),
        };
      }

      const payload: JwtPayload = {
        username,
      };
      const access_token = await this.jwtService.sign(payload);
      return {
        status_code: 200,
        status: 'success',
        message: 'User Successfully Login',
        token: access_token,
      };
    } catch (error) {
      console.log('login error >> ', error);
      return {
        status_code: 500,
        status: 'error',
        message: 'System Error',
        error,
      };
    }
  }
}
