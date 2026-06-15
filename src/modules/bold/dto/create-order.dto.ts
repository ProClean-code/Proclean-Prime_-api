import { IsArray, IsEmail, IsObject, IsString } from 'class-validator';
import { ReservationDataDto } from './reservation-data.dto';

export class CreateOrderDto {
  @IsString()
  customerName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsArray()
  fechas!: string[];

  @IsString()
  planServicio!: string;

  @IsObject()
  reservationData!: ReservationDataDto;
}
