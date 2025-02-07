import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async findOneOrderById(id: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });
  }

  async deleteOrderById(order: Order): Promise<Order> {
    return await this.orderRepository.softRemove(order);
  }
}
