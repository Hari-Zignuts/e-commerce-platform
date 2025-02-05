import * as path from 'path';
import { DataSourceOptions } from 'typeorm';

const isDevelopment = process.env.NODE_ENV === 'development';
const fileExtension = isDevelopment ? '.ts' : '.js';
const folderPath = isDevelopment ? 'src' : 'dist';

// Dynamically load all entities from modules in 'src/' or 'dist/'
const entitiesPath = path.join(
  __dirname,
  `/${folderPath}/modules/**/**/*.entity${fileExtension}`,
);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [entitiesPath],
  synchronize: false,
  migrations: [
    __dirname + `/${folderPath}/database/migrations/*${fileExtension}`,
  ],
};
