import { Test, TestingModule } from '@nestjs/testing';
import { PushService } from './push.service';
import axios from 'axios';
import { PushUserDto } from './dto/push-user.dto';

jest.mock('axios');

describe('PushService', () => {
  let pushService: PushService;
  let axiosPostMock: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushService],
    }).compile();

    pushService = module.get<PushService>(PushService);
    axiosPostMock = axios.post as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log success message when response status is 200', async () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    const user: PushUserDto = { id: 1, name: 'Test Name' };

    axiosPostMock.mockResolvedValue({ status: 200 });

    await pushService.send(user);

    expect(axiosPostMock).toHaveBeenCalledWith(
      'https://webhook.site/74409f64-d7cd-4808-ac59-2a4ee7c1da83',
      {
        id: user.id,
        message: `Hi ${user.name}, Here is a super engaging push that will bring you back to the app`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Sent push to push service for user ${user.id}`,
    );
    consoleLogSpy.mockRestore();
  });

  it('should log error when response status is not 200', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const user: PushUserDto = { id: 1, name: 'Test Name' };

    axiosPostMock.mockResolvedValue({ status: 500, data: 'Server Error' });

    await pushService.send(user);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error sending push to push service for user ${user.id}. Response status: 500. Response data: Server Error`,
    );
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error if axios.post fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const user: PushUserDto = { id: 3, name: 'Test Name' };
    const error = new Error('Network Error');
    axiosPostMock.mockRejectedValue(error);

    await expect(pushService.send(user)).rejects.toThrow(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error sending push to the user ${user.id}`,
      error,
    );
    consoleErrorSpy.mockRestore();
  });
});
