import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParkingEventDto {
  @IsString()
  @IsNotEmpty()
  parkingLotId: ParkingLotId;

  @IsString()
  @IsNotEmpty()
  vehicleId: VehicleId;
}

export class RegisterVehicleEntryDto extends CreateParkingEventDto {}
