import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGrpc } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Order } from './entities/order.entity';
import { ProductServiceClient, PRODUCT_SERVICE_NAME } from './pb/product.pb';
import { CreateOrderRequest, CreateOrderResponse } from './pb/order.pb';

@Injectable()
export class OrderService implements OnModuleInit {
  private productSvc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Order)
  private readonly repository: Repository<Order>;

  public onModuleInit(): void {
    this.productSvc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  public async createOrder(
    data: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    const { userId, shippingAddres, paymentMethod, productIdToQuantity } = data;

    const { status: availabilityStatus, error: availabilityError } =
      await firstValueFrom(
        this.productSvc.checkProductsQuantityAvailability({
          products: productIdToQuantity,
        }),
      );

    if (availabilityStatus !== 200 && availabilityError !== null) {
      return {
        id: null,
        error: availabilityError,
        status: availabilityStatus,
      };
    }

    const {
      data: sumPriceData,
      status: sumPriceStatus,
      error: sumPriceError,
    } = await firstValueFrom(
      this.productSvc.sumProductsPrice({ products: productIdToQuantity }),
    );

    if (sumPriceStatus !== 200 && sumPriceError !== null) {
      return {
        id: null,
        error: sumPriceError,
        status: sumPriceStatus,
      };
    }
    const order: Order = new Order();

    order.price = sumPriceData.price;
    order.productsIds = Object.keys(productIdToQuantity).map((key) =>
      parseInt(key, 10),
    );
    order.userId = userId;
    order.status = 'pending';
    order.shippingAddres = shippingAddres;
    order.paymentMethod = paymentMethod;

    await this.repository.save(order);

    const { status: decreasedStockStatus, error: decreasedStockError } =
      await firstValueFrom(
        this.productSvc.decreaseMultipleStockProducts({
          products: productIdToQuantity,
          userId: userId,
          reason: 'order',
          orderId: order.id,
        }),
      );

    if (decreasedStockStatus === HttpStatus.CONFLICT) {
      await this.repository.delete(order.id);

      return {
        id: null,
        error: decreasedStockError,
        status: decreasedStockStatus,
      };
    }

    return { id: order.id, error: null, status: HttpStatus.OK };
  }
}
