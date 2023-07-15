import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'eshopnestorder',
      username: 'postgres',
      password: '123',
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    OrderModule,
  ],
})
export class AppModule {}
