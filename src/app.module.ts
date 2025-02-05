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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
