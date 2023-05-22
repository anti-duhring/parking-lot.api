import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ParkingSpotsDto } from '../../parking-lot/dtos/parking-spots.dto';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(14, 14)
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password is too short' })
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ParkingSpotsDto)
  parkingSpots: ParkingSpotsDto;
}
