import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { CreateOrderPayload, OrderStatus } from '../type';

//import { Order } from '../models';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    return order;
  }

  async create(data: CreateOrderPayload): Promise<Order> {
    try {
      // Create new order
      const order = this.orderRepository.create({
        userId: data.userId,
        ...data,
        // statusHistory: [
        //   {
        //     comment: 'Order created',
        //     status: OrderStatus.Open,
        //     timestamp: Date.now(),
        //   },
        // ],
      });

      // Save the order first to get the ID
      const savedOrder = await this.orderRepository.save(order);

      // Create order items
      // const orderItems = data.items.map((item) =>
      //   this.orderItemRepository.create({
      //     order: savedOrder,
      //     product_id: item.productId,
      //     count: item.count,
      //   }),
      // );

      // Save order items
      //savedOrder.items = await this.orderItemRepository.save(orderItems);

      return savedOrder;
    } catch (error) {
      throw new BadRequestException('Failed to create order: ' + error.message);
    }
  }

  // TODO add  type
  async update(orderId: string, data: Partial<Order>): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order does not exist.');
    }

    // Update status history if status changed
    // if (data.status && data.status !== order.status) {
    //   order.statusHistory.push({
    //     status: data.status,
    //     timestamp: new Date(),
    //     comment: data.comment || `Status changed to ${data.status}`,
    //   });
    // }

    // Update order fields
    Object.assign(order, {
      ...data,
      id: orderId, // Ensure ID doesn't change
    });

    return await this.orderRepository.save(order);
  }
}
