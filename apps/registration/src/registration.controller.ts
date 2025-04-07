import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller()
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.registrationService.register(createUserDto);
  }
}
