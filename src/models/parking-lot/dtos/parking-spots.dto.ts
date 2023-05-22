import { IsDefined, IsInt, Min } from 'class-validator';

export class ParkingSpotsDto {
  @IsInt()
  @Min(0)
  @IsDefined()
  car: number;

  @IsInt()
  @Min(0)
  @IsDefined()
  motocycle: number;
}
