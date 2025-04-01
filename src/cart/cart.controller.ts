import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { CartItem } from '../entities/cartItem.entity';
import { Order } from '../entities/order.entity';
import { DataSource } from 'typeorm';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private readonly dataSource: DataSource,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartItem[]> {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req)
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: PutCartPayload,
  ): Promise<CartItem[]> {
    // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);
    const cart = this.cartService.findByUserId(userId);

    if (!(cart && (await cart).items.length)) {
      throw new BadRequestException('Cart is empty');
    }

    //const total = await this.cartService.calculateTotal(await cart);
    const order = this.orderService.create({
      userId,
      cart_id: (await cart).id,
      items: (await cart).items.map(({ product_id, count }) => ({
        productId: product_id,
        count,
      })),
      address: body.address,
      total: 0,
    });
    // Mark cart as checked out and clear it
    //await this.cartService.checkout(userId);
    await this.cartService.removeByUserId(userId);

    return {
      order,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder(): Promise<Order[]> {
    return await this.orderService.getAll();
  }
}
