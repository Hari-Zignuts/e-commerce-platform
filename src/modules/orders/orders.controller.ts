import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { OrdersService } from './orders.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';

@Controller('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateOrderDTO })
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @Req() req: ReqPayload,
  ) {
    const order = await this.orderService.createOrder(createOrderDTO, req);
    return {
      message: 'Order created successfully',
      data: order,
    };
  }
}
