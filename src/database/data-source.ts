import { Address } from 'src/modules/addresses/address.entity';
import { Category } from 'src/modules/categories/category.entity';
import { LikeProduct } from 'src/modules/likes/like.entity';
import { Order } from 'src/modules/orders/order.entity';
import { Image } from 'src/modules/products/entities/image.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Stock } from 'src/modules/products/entities/stock.entity';
import { Role } from 'src/modules/roles/role.entity';
import { User } from 'src/modules/users/user.entity';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'ztlab138',
  database: process.env.DB_NAME || 'e_commerce_platform',
  entities: [
    User,
    Role,
    Product,
    Image,
    Category,
    Stock,
    Order,
    LikeProduct,
    Address,
  ],
  synchronize: false,
  // here if i write migrations: ['dist/database/migrations/*.ts'] it will not work
  // because the migrations files are compiled to js files
  // if i write src/database/migrations/*.ts it will not work because the migrations files are not compiled yet
  // and give me circular dependency error
  migrations:
    process.env.NODE_ENV === 'test'
      ? ['src/database/migrations/*.ts']
      : ['dist/database/migrations/*.js'],
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
