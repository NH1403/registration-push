import { Test, TestingModule } from '@nestjs/testing';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { PushUserDto } from './dto/push-user.dto';
import { RmqContext } from '@nestjs/microservices';

describe('PushController', () => {
  let pushController: PushController;
  let pushService: PushService;

  const mockPushService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushController],
      providers: [
        {
          provide: PushService,
          useValue: mockPushService,
        },
      ],
    }).compile();

    pushController = module.get<PushController>(PushController);
    pushService = module.get<PushService>(PushService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call pushService.send() with user data and acknowledge the message', async () => {
    const mockUser: PushUserDto = {
      id: 1,
      name: 'Test Name',
    };

    const mockAck = jest.fn();
    const dummyContext: Partial<RmqContext> = {
      getChannelRef: () => ({ ack: mockAck }),
      getMessage: () => ({}),
    };

    await pushController.sendPush(mockUser, dummyContext as RmqContext);

    expect(mockAck).toHaveBeenCalledTimes(1);
    expect(pushService.send).toHaveBeenCalledWith(mockUser);
    expect(pushService.send).toHaveBeenCalledTimes(1);
  });
});
