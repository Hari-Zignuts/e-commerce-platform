import { HttpException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDTO } from './dto/create-order-dto';
import { Order } from './order.entity';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
    private readonly addressService: AddressesService,
  ) {}

  async createOrder(createOrderDTO: CreateOrderDTO, req: ReqPayload) {
    const user = await this.userService.getOneUserById(req.user.id);
    const product = await this.productService.getOneProductById(
      createOrderDTO.product,
    );
    const address = await this.addressService.getOneAddressById(
      createOrderDTO.address,
    );
    await this.productService.updateStock(
      product.stock.id,
      createOrderDTO.quantity,
    );
    const order = new Order();
    order.user = user;
    order.product = product;
    order.address = address;
    order.quantity = createOrderDTO.quantity;
    order.total = product.price * createOrderDTO.quantity;
    order.status = 'pending';
    const newOrder = await this.ordersRepository.createOrder(order);
    if (!newOrder) {
      throw new HttpException('Order not created', 500);
    }
    return newOrder;
  }
}
