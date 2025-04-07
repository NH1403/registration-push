import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RegistrationModule } from '../src/registration.module';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { of } from 'rxjs';

class FakeUserRepository {
  create(dto: any) {
    return { ...dto, id: 1 };
  }
  async save(user: any) {
    return user;
  }
}

describe('RegistrationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [RegistrationModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(new FakeUserRepository())
      .overrideProvider('delay_for_push_client')
      .useValue({
        emit: jest.fn().mockReturnValue(of({})),
      })
      .overrideProvider(getDataSourceToken())
      .useValue({ close: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST / should register a user and return the saved user', async () => {
    const createUserDto = { name: 'Test User' };

    const response = await request(app.getHttpServer())
      .post('/')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      name: 'Test User',
    });
  });
});
