import { Controller, Get } from '@nestjs/common';
import { PushService } from './push.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PushUserDto } from './dto/push-user.dto';

@Controller()
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @EventPattern('push_registered_user')
  async sendPush(@Payload() user: PushUserDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    await channel.ack(originalMessage);

    this.pushService.send(user);
  }
}
