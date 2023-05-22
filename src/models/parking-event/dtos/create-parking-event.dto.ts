import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidCarType } from '../../../common/decorators/IsValidCarType.decorator';
import { DeepPartial } from 'typeorm';
import { VehicleTypesEnum } from '../../../models/vehicle/dto/vehicle-type.dto';

export class CreateParkingEventDto {
  @IsString()
  @IsNotEmpty()
  parkingLotId: ParkingLotId;

  @IsString()
  @IsNotEmpty()
  vehicleId: VehicleId;

  @IsString()
  @IsNotEmpty()
  @IsValidCarType()
  vehicleType: DeepPartial<VehicleTypesEnum>;
}

export class RegisterVehicleEntryDto extends CreateParkingEventDto {}
