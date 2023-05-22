import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParkingLotService } from '../parking-lot/parking-lot.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { RegisterVehicleEntryDto } from './dtos/create-parking-event.dto';
import { ParkingEvent } from './entity/parking-event.entity';
import {
  ParkingEventNotFoundException,
  ParkingEventWithConflict,
  VehicleExitAlreadyBeenRegisteredException,
} from '../../common/exceptions';

@Injectable()
export class ParkingEventService {
  user: CompanyUser;

  constructor(
    @InjectRepository(ParkingEvent)
    private readonly repo: Repository<ParkingEvent>,
    private readonly vehicleService: VehicleService,
    private readonly parkingLotService: ParkingLotService,
  ) {}

  async registerEntry(entryDto: RegisterVehicleEntryDto) {
    const { vehicleId, parkingLotId } = entryDto;

    await this.validateIfVehicleHasParkingEventWithoutExit(vehicleId);

    const vehicle = await this.vehicleService.findOne(vehicleId);
    const parkingLot = await this.parkingLotService.findOne(parkingLotId);

    const event = this.repo.create({
      vehicle,
      parkingLot,
      dateTimeEntry: new Date(),
    });

    return await this.repo.save(event);
  }

  async registerExit(id: ParkingEventId) {
    const event = await this.findOne(id);

    if (event.dateTimeExit)
      throw new VehicleExitAlreadyBeenRegisteredException(id);

    event.dateTimeExit = new Date();

    return await this.repo.save(event);
  }

  async findOne(id: ParkingEventId) {
    try {
      const parkingEvent = await this.repo.findOneByOrFail({ id });
      return parkingEvent;
    } catch (err) {
      throw new ParkingEventNotFoundException(id);
    }
  }

  async getLastParkingEventByVehicleId(vehicleId: VehicleId) {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    vehicle.parkingEvents.sort((a, b) => {
      return b.dateTimeEntry.getTime() - a.dateTimeEntry.getTime();
    });

    return vehicle.parkingEvents[0];
  }

  private async validateIfVehicleHasParkingEventWithoutExit(
    vehicleId: VehicleId,
  ) {
    const lastParkingEvent = await this.getLastParkingEventByVehicleId(
      vehicleId,
    );

    if (!lastParkingEvent) return;

    const lastParkingEventIsStillActive = Boolean(
      lastParkingEvent.dateTimeExit,
    );

    if (!lastParkingEventIsStillActive) {
      throw new ParkingEventWithConflict(
        `Vehicle ${vehicleId} has an active parking event without exit with id ${lastParkingEvent.id}`,
      );
    }
  }
}
