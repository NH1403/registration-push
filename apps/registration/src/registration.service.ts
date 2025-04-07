import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('delay_for_push_client')
    private readonly delayForPushClient: ClientProxy,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userData = this.userRepository.create(createUserDto);
      const userRecord = await this.userRepository.save(userData);
      await lastValueFrom(
        this.delayForPushClient.emit('push_registered_user', userRecord),
      );
      console.log(`Registered user ${userRecord.id}`);
      return userRecord;
    } catch (error) {
      console.log(`Error registering user: ${error}`);
      throw new InternalServerErrorException(`Failed to save user`);
    }
  }
}
