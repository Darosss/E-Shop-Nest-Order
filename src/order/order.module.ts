import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { PRODUCT_SERVICE_NAME, PRODUCT_PACKAGE_NAME } from './pb/product.pb';
import { PRODUCT_MICROSERVICE_URL } from 'src/configs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: PRODUCT_MICROSERVICE_URL,
          package: PRODUCT_PACKAGE_NAME,
          protoPath: 'node_modules/e-shop-nest-proto/proto/product.proto',
        },
      },
    ]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
