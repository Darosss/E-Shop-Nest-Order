import { IsNotEmpty, IsNumber, IsObject, IsString, Min } from 'class-validator';
import { CreateOrderRequest } from '../pb/order.pb';
import { IsPositiveValues } from './validator.helper';

export class CreateOrderRequestDto implements CreateOrderRequest {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public userId: number;

  //TODO: add validation for these:
  @IsObject({
    message: 'productIdToQuantity must be an object of {id: quantity}',
  })
  @IsPositiveValues()
  public productIdToQuantity: { [key: number]: number };

  @IsString()
  @IsNotEmpty()
  public shippingAddres: string;

  @IsString()
  @IsNotEmpty()
  public paymentMethod: string;
}
