import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { RolesGuard } from 'src/common/guards/role.guard';
import { isUUID } from 'class-validator';

@Controller('orders')
@ApiBearerAuth()
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  /**
   * @version 1.0.0
   * @route POST /orders
   * @description Create a new order
   */
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @Req() req: ReqPayload,
  ) {
    const order = await this.orderService.createOrder(createOrderDTO, req);
    return {
      message: ResponseMessages.ORDER.CREATED,
      data: order,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /orders/all-users
   * @description Get all orders of all users (admin only)
   */
  @Get('all-users')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all orders of all users (admin only)' })
  async getAllOrders() {
    const orders = await this.orderService.getAllOrders();
    return {
      message: ResponseMessages.ORDER.FETCHED,
      data: orders,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /orders/:id
   * @description Get an order by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  async getOneOrderById(@Param('id') id: string) {
    const order = await this.orderService.getOneOrderById(id);
    return {
      message: ResponseMessages.ORDER.FETCHED,
      data: order,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /orders
   * @description Get all orders for the logged-in user
   */
  @Get()
  @ApiOperation({ summary: 'Get all orders for the logged-in user' })
  async getOrdersByUser(@Req() req: ReqPayload) {
    const orders = await this.orderService.getOrdersByUser(req.user.id);
    return {
      message: ResponseMessages.ORDER.FETCHED,
      data: orders,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /orders/:id/complete
   * @description Complete an order (admin only)
   */
  @Put(':id/complete')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Complete an order (admin only)' })
  async completeOrder(@Param('id') id: string) {
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.ORDER.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const order = await this.orderService.getOneOrderById(id);
    if (order.status !== 'pending') {
      throw new HttpException(
        ResponseMessages.ORDER.NOT_PENDING,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedOrder = await this.orderService.updateOrderStatus(
      id,
      'completed',
    );
    return {
      message: ResponseMessages.ORDER.COMPLETED,
      data: updatedOrder,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /orders/:id/cancel
   * @description Cancel an order (admin only)
   */
  @Put(':id/cancel')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel an order (admin only)' })
  async cancelOrder(@Param('id') id: string) {
    const order = await this.orderService.updateOrderStatus(id, 'cancelled');
    return {
      message: ResponseMessages.ORDER.CANCELLED,
      data: order,
    };
  }

  /**
   * @version 1.0.0
   * @route DELETE /orders/:id
   * @description Delete an order
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  async deleteOrder(@Param('id') id: string) {
    await this.orderService.deleteOrder(id);
    return {
      message: ResponseMessages.ORDER.DELETED,
    };
  }
}
