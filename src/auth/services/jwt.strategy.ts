import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt_payload.interface';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'TaskManagementSecret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const get_user = await this.userRepository.findOne({ username });

    if (!get_user) {
      throw new UnauthorizedException();
    }
    return get_user;
  }
}
