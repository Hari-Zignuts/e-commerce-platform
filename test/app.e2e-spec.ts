import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Test Environment', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.runMigrations();
    // await seedDatabase(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should be running in test mode', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('/test (GET) should return Hello World', async () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect((res) => {
        expect(res.text).toBe('Hello World!');
      });
  });
});
