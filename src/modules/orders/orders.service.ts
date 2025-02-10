import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDTO } from './dto/create-order-dto';
import { Order } from './order.entity';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AddressesService } from '../addresses/addresses.service';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { isUUID } from 'class-validator';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
    private readonly addressService: AddressesService,
  ) {}

  /**
   * @version 1.0.0
   * @function createOrder
   * @description Create a new order
   */
  async createOrder(createOrderDTO: CreateOrderDTO, req: ReqPayload) {
    const user = await this.userService.getOneUserById(req.user.id);
    const product = await this.productService.getOneProductById(
      createOrderDTO.product,
    );
    const address = await this.addressService.getOneAddressById(
      createOrderDTO.address,
    );
    await this.productService.ReduceStock(
      product.stock.id,
      createOrderDTO.quantity,
    );
    const order = new Order();
    Object.assign(order, {
      user,
      product,
      address,
      quantity: createOrderDTO.quantity,
      total: product.price * createOrderDTO.quantity,
      status: 'pending',
    });
    const newOrder = await this.ordersRepository.saveOrder(order);
    if (!newOrder) {
      throw new HttpException(
        ResponseMessages.ORDER.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newOrder;
  }

  /**
   * @version 1.0.0
   * @function getOneOrderById
   * @description Get an order by ID
   */
  async getOneOrderById(id: string) {
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.ORDER.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const order = await this.ordersRepository.findOneOrderById(id);
    if (!order) {
      throw new HttpException(
        ResponseMessages.ORDER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return order;
  }

  /**
   * @version 1.0.0
   * @function getOrdersByUser
   * @description Get all orders of a user
   */
  async getOrdersByUser(userId: string) {
    if (!userId || !isUUID(userId)) {
      throw new HttpException(
        ResponseMessages.USER.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const allOrders = await this.getAllOrders();
    const orders = allOrders.filter((order) => order.user.id === userId);
    if (!orders) {
      throw new HttpException(
        ResponseMessages.ORDER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return orders;
  }

  /**
   * @version 1.0.0
   * @function getAllOrders
   * @description Get all orders
   */
  async getAllOrders() {
    const orders = await this.ordersRepository.findAllOrders();
    if (!orders) {
      throw new HttpException(
        ResponseMessages.ORDER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return orders;
  }

  /**
   * @version 1.0.0
   * @function updateOrderStatus
   * @description Update an order
   */
  async updateOrderStatus(id: string, status: string) {
    const order = await this.getOneOrderById(id);
    const product = await this.productService.getOneProductById(
      order.product.id,
    );
    order.status = status;
    if (status === 'cancelled') {
      await this.productService.updateStock(
        product.stock.id,
        order.quantity + product.stock.quantity,
      );
    }

    const updatedOrder = await this.ordersRepository.saveOrder(order);
    if (!updatedOrder) {
      throw new HttpException(
        ResponseMessages.ORDER.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedOrder;
  }

  /**
   * @version 1.0.0
   * @function deleteOrder
   * @description Delete an order
   */
  async deleteOrder(id: string) {
    const order = await this.getOneOrderById(id);
    const product = await this.productService.getOneProductById(
      order.product.id,
    );
    if (order.status === 'pending') {
      await this.productService.updateStock(
        product.stock.id,
        order.quantity + product.stock.quantity,
      );
    }
    const deletedOrder = await this.ordersRepository.deleteOrder(order);
    if (!deletedOrder) {
      throw new HttpException(
        ResponseMessages.ORDER.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletedOrder;
  }
}
