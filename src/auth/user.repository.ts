import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCreadentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createNew(authCredialsDto: AuthCreadentialsDto): Promise<void> {
    const { username, password } = authCredialsDto;

    const new_user = new User();
    new_user.username = username;
    new_user.salt = await bcrypt.genSalt();
    new_user.password = await this.hashPassword(password, new_user.salt);
    await new_user.save();
  }

  async validateUserPassword(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<any> {
    const { username, password } = authCredentialsDto;
    const get_user = await this.findOne({ username });
    if (get_user && (await get_user.validatePassword(password))) {
      return get_user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
