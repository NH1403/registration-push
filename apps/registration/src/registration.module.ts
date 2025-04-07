import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RmqModule, RmqService } from '@app/common';
import { DELAY_FOR_PUSH_MS } from './constants/push.constants';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    RmqModule,
    ClientsModule.registerAsync([
      {
        name: 'delay_for_push_client',
        imports: [RmqModule],
        inject: [RmqService],
        useFactory: (rmqService: RmqService) =>
          rmqService.getOptions(
            'delay_for_push',
            true,
            DELAY_FOR_PUSH_MS,
            'push',
          ),
      },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
