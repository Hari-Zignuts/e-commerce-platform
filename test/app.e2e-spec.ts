import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { seedDatabase } from 'src/database/seeders/seed-database';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { CreateUserDTO } from 'src/modules/users/dto/create-user-dto';
import { User } from 'src/modules/users/user.entity';
import { CreateCategoryDTO } from 'src/modules/categories/dto/create-category-dto';
import { Category } from 'src/modules/categories/category.entity';
import { CreateAddressDTO } from 'src/modules/addresses/dto/create-address-dto';
import { Address } from 'src/modules/addresses/address.entity';
import { Role } from 'src/modules/roles/role.entity';

describe('Test Environment', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const user: User[] = [];
  const category: Category[] = [];
  const address: Address[] = [];
  const token = {
    user: '',
    admin: '',
  };
  const testUser: CreateUserDTO = {
    email: 'testuser@gmail.com',
    username: 'testuser',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  };

  const testAdmin = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.synchronize(true);
    await seedDatabase(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('shouldbe running in test mode', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('/test (GET) should retrun "Hello World!"', () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect((res) => {
        expect(res.text).toBe('Hello World!');
      });
  });

  describe('Authentication', () => {
    const createUser = async (user: CreateUserDTO) => {
      return await request(app.getHttpServer()).post('/auth/signup').send(user);
    };
    describe('POST /auth/signup', () => {
      it('should create a new user', async () => {
        const res = await createUser(testUser);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User account created successfully.');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toBe(testUser.email);
        expect(res.body.data.username).toBe(testUser.username);
        user.push(res.body.data);
      });
    });

    describe('POST /auth/login', () => {
      it('should login a user', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            useranme: testUser.username,
            password: testUser.password,
          });
        token.user = res.body.token;
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User logged in successfully.');
        expect(res.body).toHaveProperty('token');
      });
    });

    describe('POST /auth/login', () => {
      it('should login a admin', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ useranme: testAdmin.username, password: testAdmin.password });
        token.admin = res.body.token;
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User logged in successfully.');
        expect(res.body).toHaveProperty('token');
      });
    });
  });

  describe('Users', () => {
    afterAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ useranme: testUser.username, password: testUser.password });
      token.user = res.body.token;
    });

    describe('GET /users', () => {
      it('should return all users', async () => {
        const res = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
      });
    });

    describe('GET /users/id/:id', () => {
      it('should return a user', async () => {
        const res = await request(app.getHttpServer())
          .get(`/users/id/${user[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(user[0].id);
        expect(res.body.data.email).toBe(user[0].email);
        expect(res.body.data.username).toBe(user[0].username);
      });
    });

    describe('PUT /users/:id', () => {
      it('should update a user', async () => {
        const res = await request(app.getHttpServer())
          .put(`/users/${user[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`)
          .send({ firstName: 'Test1', lastName: 'User' });
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(user[0].id);
        expect(res.body.data.firstName).toBe('Test1');
        expect(res.body.data.lastName).toBe('User');
      });
    });

    describe('DELETE /users/:id', () => {
      it('should delete a user', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/users/${user[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.username).toBe(user[0].username);
        user.shift();
      });
    });

    describe('POST /users', () => {
      it('should create a new user', async () => {
        const res = await request(app.getHttpServer())
          .post('/users')
          .set('Authorization', `Bearer ${token.admin}`)
          .send(testUser);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe(
          'The user account has been created successfully.',
        );
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toBe(testUser.email);
        expect(res.body.data.username).toBe(testUser.username);
        user.push(res.body.data);
      });
    });

    describe('GET /users/username/:username', () => {
      it('should return a user', async () => {
        const res = await request(app.getHttpServer())
          .get(`/users/username/${user[0].username}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(user[0].id);
        expect(res.body.data.email).toBe(user[0].email);
        expect(res.body.data.username).toBe(user[0].username);
        user.push(res.body.data);
      });
    });
  });

  describe('Roles', () => {
    const role: Role[] = [];
    describe('GET /roles', () => {
      it('should return all roles', async () => {
        const res = await request(app.getHttpServer())
          .get('/roles')
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
      });
    });

    describe('POST /roles/:name', () => {
      it('should create a new role', async () => {
        const res = await request(app.getHttpServer())
          .post('/roles/Super_User')
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Role created successfully.');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.name).toBe('Super_User');
        role.push(res.body.data);
      });
    });

    describe('GET /roles/name/:name', () => {
      it('should return a role', async () => {
        const res = await request(app.getHttpServer())
          .get(`/roles/name/${role[0].name}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(role[0].id);
        expect(res.body.data.name).toBe(role[0].name);
      });
    });

    describe('GET /roles/id/:id', () => {
      it('should return a role', async () => {
        const res = await request(app.getHttpServer())
          .get(`/roles/id/${role[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(role[0].id);
        expect(res.body.data.name).toBe(role[0].name);
      });
    });

    describe('PUT /roles/:id', () => {
      it('should update a role', async () => {
        const res = await request(app.getHttpServer())
          .put(`/roles/${role[0].id}?name=Super_Admin_Updated`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(role[0].id);
        expect(res.body.data.name).toBe('Super_Admin_Updated');
      });
    });

    describe('DELETE /roles/:id', () => {
      it('should delete a role', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/roles/${role[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Super_Admin_Updated');
        role.shift();
      });
    });
  });

  describe('Categories', () => {
    const testCategoryDTO: CreateCategoryDTO = {
      title: 'Category 1',
      description: 'Category 1 description',
    };
    afterAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token.admin}`)
        .send(testCategoryDTO);
      category.push(res.body.data);
    });
    describe('POST /categories', () => {
      it('should create a new category', async () => {
        const res = await request(app.getHttpServer())
          .post('/categories')
          .set('Authorization', `Bearer ${token.admin}`)
          .send(testCategoryDTO);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe(
          'The category has been created successfully.',
        );
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.title).toBe(testCategoryDTO.title);
        category.push(res.body.data);
      });
    });

    describe('GET /categories', () => {
      it('should return all categories', async () => {
        const res = await request(app.getHttpServer())
          .get('/categories')
          .set('Authorization', `Bearer ${token.user}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
      });
    });

    describe('GET /categories/id/:id', () => {
      it('should return a category', async () => {
        const res = await request(app.getHttpServer())
          .get(`/categories/id/${category[0].id}`)
          .set('Authorization', `Bearer ${token.user}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(category[0].id);
        expect(res.body.data.title).toBe(category[0].title);
      });
    });

    describe('PUT /categories/:id', () => {
      it('should update a category', async () => {
        const res = await request(app.getHttpServer())
          .put(`/categories/${category[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`)
          .send({ title: 'Category 2' });
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(category[0].id);
        expect(res.body.data.title).toBe('Category 2');
      });
    });

    describe('DELETE /categories/:id', () => {
      it('should delete a category', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/categories/${category[0].id}`)
          .set('Authorization', `Bearer ${token.admin}`);
        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe('Category 2');
        category.shift();
      });
    });
  });

  describe('Addresses', () => {
    const testAddressDTO: CreateAddressDTO = {
      street: '1234 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    };
    afterAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${token.user}`)
        .send(testAddressDTO);
      address.push(res.body.data);
    });
    describe('POST /addresses', () => {
      it('should create a new address', async () => {
        const res = await request(app.getHttpServer())
          .post('/addresses')
          .set('Authorization', `Bearer ${token.user}`)
          .send(testAddressDTO);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe(
          'The address has been created successfully.',
        );
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.street).toBe(testAddressDTO.street);
        address.push(res.body.data);
      });
    });

    describe('GET /addresses', () => {
      it('should return all addresses', async () => {
        const res = await request(app.getHttpServer())
          .get('/addresses')
          .set('Authorization', `Bearer ${token.user}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
      });
    });

    describe('GET /addresses/:id', () => {
      it('should return an address', async () => {
        const res = await request(app.getHttpServer())
          .get(`/addresses/${address[0].id}`)
          .set('Authorization', `Bearer ${token.user}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(address[0].id);
        expect(res.body.data.street).toBe(address[0].street);
      });
    });

    describe('PUT /addresses/:id', () => {
      it('should update an address', async () => {
        const res = await request(app.getHttpServer())
          .put(`/addresses/${address[0].id}`)
          .set('Authorization', `Bearer ${token.user}`)
          .send({ street: '5678 Elm St' });
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(address[0].id);
        expect(res.body.data.street).toBe('5678 Elm St');
      });
    });

    describe('DELETE /addresses/:id', () => {
      it('should delete an address', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/addresses/${address[0].id}`)
          .set('Authorization', `Bearer ${token.user}`);
        expect(res.status).toBe(200);
        expect(res.body.data.street).toBe('5678 Elm St');
        address.shift();
      });
    });
  });
});
