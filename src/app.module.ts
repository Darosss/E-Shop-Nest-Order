import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { databaseConfig } from './configs';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), OrderModule],
})
export class AppModule {}
