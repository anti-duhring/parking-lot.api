import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  Min,
  ValidateNested,
} from 'class-validator';

import { Company } from '../../company/entity/company.entity';

export class CreateParkingLotDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsInt()
  @Min(0)
  @IsDefined()
  car: number;

  @IsInt()
  @Min(0)
  @IsDefined()
  motocycle: number;
}
