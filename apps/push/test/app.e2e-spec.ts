import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PushModule } from '../src/push.module';
import { RmqService } from '@app/common';
import { PushController } from '../src/push.controller';
import { PushService } from '../src/push.service';
import { PushUserDto } from '../src/dto/push-user.dto';
import { RmqContext } from '@nestjs/microservices';

class FakeRmqService {
  getOptions(queue: string) {
    return {
      transport: 0,
      options: {},
    };
  }
}

class FakePushService {
  send = jest.fn().mockResolvedValue(undefined);
}

describe('PushModule (e2e)', () => {
  let app: INestApplication;
  let pushController: PushController;
  let fakePushService: FakePushService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PushModule],
    })
      .overrideProvider(RmqService)
      .useValue(new FakeRmqService())
      .overrideProvider(PushService)
      .useValue(new FakePushService())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const rmqService = moduleFixture.get<RmqService>(RmqService);
    app.connectMicroservice(rmqService.getOptions('push'));

    await app.startAllMicroservices();
    await app.init();

    pushController = app.get(PushController);
    fakePushService = moduleFixture.get(PushService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should trigger pushService.send when push_registered_user event is received', async () => {
    const pushUserDto: PushUserDto = { id: 1, name: 'Test Name' };

    const dummyContext: Partial<RmqContext> = {
      getChannelRef: () => ({ ack: jest.fn() }),
      getMessage: () => ({}),
    };

    await pushController.sendPush(pushUserDto, dummyContext as RmqContext);

    expect(fakePushService.send).toHaveBeenCalledWith(pushUserDto);
    expect(fakePushService.send).toHaveBeenCalledTimes(1);
  });
});
