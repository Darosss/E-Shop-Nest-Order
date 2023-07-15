import { IsNumber, Min } from 'class-validator';
import { CreateOrderRequest } from '../pb/order.pb';

export class CreateOrderRequestDto implements CreateOrderRequest {
  @IsNumber()
  public productId: number;

  @IsNumber()
  @Min(1)
  public quantity: number;

  @IsNumber()
  public userId: number;
}
