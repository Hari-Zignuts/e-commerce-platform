<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# E-Commerce Platform Backend

## Description
The **E-Commerce Platform Backend** is built using **NestJS** and **PostgreSQL** with **TypeORM**. It provides a RESTful API for managing users, roles, products, categories, orders, addresses, and authentication. The system includes role-based access control and integrates Cloudinary for media storage.

## Features
- **Authentication & Authorization** (JWT-based, Role-based access)
- **User Management** (Signup, Login, Profile)
- **Role Management** (Admin Only)
- **Product & Category Management**
- **Order Management**
- **Address Management**
- **Like System**
- **File Upload with Multer & Cloudinary**
- **Docker Support**
- **Swagger API Documentation**
- **Unit & E2E Testing**

## Technologies Used
- **NestJS** (Node.js Framework)
- **TypeORM** (ORM for PostgreSQL)
- **PostgreSQL** (Relational Database)
- **JWT & Bcrypt** (Authentication & Password Hashing)
- **Multer & Cloudinary** (File Upload & Storage)
- **Swagger** (API Documentation)
- **Docker** (Containerization)
- **Jest** (Testing Framework)

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+)
- **PostgreSQL**
- **Docker** (Optional, for containerized deployment)

### Clone the Repository
```bash
git clone https://github.com/Hari-Zignuts/e-commerce-platform.git
cd e-commerce-platform
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create the following environment files in the root directory:

#### `.env.development`
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=ecommerce_dev
DB_PORT=5432

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

#### `.env.test`
```env
NODE_ENV=test
PORT=3001

DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=ecommerce_test
DB_PORT=5432

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

#### `.env.production`
```env
NODE_ENV=production
PORT=3000

DB_HOST=your_production_host
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=ecommerce_prod
DB_PORT=5432

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

### Database Migration & Seeding
```bash
npm run migration:run
npm run seed:run
```

### Running the Application
#### Development Mode
```bash
npm run start:dev
```
#### Production Mode
```bash
npm run start:prod
```
#### Run with Docker
```bash
docker-compose up --build
```

## API Documentation
The project includes Swagger API documentation. After running the project, access it at:
```
http://localhost:3000/api
```

## Testing
Run unit and e2e tests:
```bash
npm run test:unit
npm run test:e2e
```

## Endpoints Overview

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - User login

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users (Admin only)
- `GET /users/id/{id}` - Get a user by ID
- `GET /users/username/{username}` - Get a user by username
- `PUT /users/{id}` - Update a user by ID
- `DELETE /users/{id}` - Delete a user by ID

### Roles
- `POST /roles/{name}` - Create a new role (Admin only)
- `GET /roles` - Get all roles
- `GET /roles/name/{name}` - Get a role by name
- `GET /roles/id/{id}` - Get a role by ID
- `PUT /roles/{id}` - Update a role by ID (Admin only)
- `DELETE /roles/{id}` - Delete a role by ID (Admin only)

### Products
- `POST /products` - Create a new product
- `GET /products` - Find all products
- `GET /products/{id}` - Get a product by ID
- `PUT /products/{id}` - Update a product by ID (Admin only)
- `DELETE /products/{id}` - Delete a product by ID (Admin only)

### Categories
- `POST /categories` - Create a new category (Admin only)
- `GET /categories` - Get all categories
- `GET /categories/id/{id}` - Get a category by ID
- `PUT /categories/{id}` - Update a category by ID (Admin only)
- `DELETE /categories/{id}` - Delete a category by ID (Admin only)

### Likes
- `POST /likes` - Create a like
- `GET /likes` - Get all likes
- `GET /likes/{id}` - Get a like by ID
- `DELETE /likes/{id}` - Delete a like

### Addresses
- `POST /addresses` - Create a new address
- `GET /addresses` - Get all addresses of the logged-in user
- `GET /addresses/{id}` - Get an address by ID
- `PUT /addresses/{id}` - Update an address by ID
- `DELETE /addresses/{id}` - Delete an address by ID

### Orders
- `POST /orders` - Create a new order
- `GET /orders` - Get all orders for the logged-in user
- `GET /orders/all-users` - Get all orders of all users (Admin only)
- `GET /orders/{id}` - Get an order by ID
- `DELETE /orders/{id}` - Delete an order
- `PUT /orders/{id}/complete` - Complete an order (Admin only)
- `PUT /orders/{id}/cancel` - Cancel an order (Admin only)


## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "feat: add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.

## Author
Developed by **Malam Hari**
