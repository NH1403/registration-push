import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('RegistrationController', () => {
  let registrationController: RegistrationController;
  let registrationService: RegistrationService;

  beforeEach(async () => {
    const mockRegistrationService = {
      register: jest.fn((dto: CreateUserDto): Promise<User> => {
        return Promise.resolve({
          id: 1,
          name: dto.name,
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: RegistrationService,
          useValue: mockRegistrationService,
        },
      ],
    }).compile();

    registrationController = module.get<RegistrationController>(
      RegistrationController,
    );
    registrationService = module.get<RegistrationService>(RegistrationService);
  });

  describe('registerUser', () => {
    it('should call RegistrationService.register and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test Name',
      };

      const expectedUser: User = {
        id: 1,
        name: 'Test Name',
      };

      jest
        .spyOn(registrationService, 'register')
        .mockResolvedValue(expectedUser);

      const result = await registrationController.registerUser(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(registrationService.register).toHaveBeenCalledWith(createUserDto);
    });
  });
});
