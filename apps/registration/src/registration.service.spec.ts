import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { of } from 'rxjs';

describe('RegistrationService', () => {
  let registrationService: RegistrationService;
  let userRepository: { create: jest.Mock; save: jest.Mock };
  let delayForPushClient: { emit: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'delay_for_push_client',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    registrationService = module.get<RegistrationService>(RegistrationService);
    userRepository = module.get(getRepositoryToken(User));
    delayForPushClient = module.get('delay_for_push_client');
  });

  describe('register', () => {
    it('should register a user and emit push event', async () => {
      const createUserDto = { name: 'Test Name' };
      const createdUser = { id: 1, name: 'Test Name' };

      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      delayForPushClient.emit.mockReturnValue(of({}));

      const result = await registrationService.register(createUserDto);

      expect(result).toEqual(createdUser);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(delayForPushClient.emit).toHaveBeenCalledWith(
        'push_registered_user',
        createdUser,
      );
    });

    it('should throw InternalServerErrorException if saving the user fails', async () => {
      const createUserDto = { name: 'Test Name' };
      const createdUser = { name: 'Test Name' };

      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(registrationService.register(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
