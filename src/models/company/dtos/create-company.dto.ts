import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class ParkingSpots {
  @IsInt()
  @Min(0)
  @IsDefined()
  car: number;

  @IsInt()
  @Min(0)
  @IsDefined()
  motocycle: number;
}

export default class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ParkingSpots)
  parkingSpots: ParkingSpots;
}
