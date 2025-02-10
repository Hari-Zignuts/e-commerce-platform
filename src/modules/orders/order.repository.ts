import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * @version 1.0.0
   * @function saveOrder
   * @description Save or Update an order in the database
   */
  async saveOrder(order: Order): Promise<Order> {
    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findOneOrderById
   * @description Find an order by ID and return the order object
   */
  async findOneOrderById(id: string): Promise<Order | null> {
    try {
      return await this.orderRepository.findOne({
        where: { id, deletedAt: IsNull() },
        relations: ['product', 'user', 'address'],
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findAllOrders
   * @description Find all orders in the database
   */
  async findAllOrders(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { deletedAt: IsNull() },
        relations: ['product', 'address', 'user'],
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function deleteOrderById
   * @description Soft delete an order in the database
   */
  async deleteOrder(order: Order): Promise<Order | null> {
    try {
      return await this.orderRepository.remove(order);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }
}
