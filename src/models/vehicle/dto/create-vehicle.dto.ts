import { IsNotEmpty, IsString } from 'class-validator';
import { IsBrazilianVehiclePlate } from '../../../common/decorators/IsBrazilianVehiclePlate.decorator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  @IsBrazilianVehiclePlate()
  plate: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  companyId: CompanyId;
}
