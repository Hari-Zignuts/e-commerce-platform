import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { LikesModule } from './modules/likes/likes.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RolesModule } from './modules/roles/roles.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ConfigAppModule } from './modules/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    LikesModule,
    RolesModule,
    AddressesModule,
    OrdersModule,
    ConfigAppModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(readonly dataSource: DataSource) {
    console.log(
      `Database connection to ${dataSource.driver.database}: ${dataSource.isConnected}`,
    );
  }
}
