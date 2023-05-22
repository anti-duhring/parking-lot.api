import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParkingLotModule } from '../parking-lot/parking-lot.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ParkingEvent } from './entity/parking-event.entity';
import { ParkingEventService } from './parking-event.service';
import { ParkingEventController } from './parking-event.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParkingEvent]),
    VehicleModule,
    ParkingLotModule,
  ],
  providers: [ParkingEventService],
  controllers: [ParkingEventController],
})
export class ParkingEventModule {}
