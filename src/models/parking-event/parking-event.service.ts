import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { ParkingLotService } from '../parking-lot/parking-lot.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { RegisterVehicleEntryDto } from './dtos/create-parking-event.dto';
import { ParkingEvent } from './entity/parking-event.entity';
import {
  ParkingEventNotFoundException,
  ParkingEventWithConflict,
  VehicleExitAlreadyBeenRegisteredException,
} from '../../common/exceptions';
import { ServiceWithAuth } from '../../common/interfaces/service-with-auth.interface';
import { VehicleTypesEnum } from '../vehicle/dto/vehicle-type.dto';

// TODO: Validar entrada e saída com base na quantidade de vagas

@Injectable()
export class ParkingEventService implements ServiceWithAuth {
  user: CompanyUser;

  constructor(
    @InjectRepository(ParkingEvent)
    private readonly repo: Repository<ParkingEvent>,
    private readonly vehicleService: VehicleService,
    private readonly parkingLotService: ParkingLotService,
  ) {}

  async registerEntry(entryDto: RegisterVehicleEntryDto) {
    try {
      const { vehicleId, parkingLotId, vehicleType } = entryDto;

      await this.validateUserPermissionByParkingLotId(parkingLotId);
      await this.validateIfVehicleHasParkingEventWithoutExit(vehicleId);
      await this.validateIfParkingLotHasAvaliableSpots(
        parkingLotId,
        vehicleType,
      );

      const vehicle = await this.vehicleService.findOne(vehicleId);
      const parkingLot = await this.parkingLotService.findOne(parkingLotId);

      const event = this.repo.create({
        vehicle,
        parkingLot,
        vehicleType,
        dateTimeEntry: new Date(),
      });

      return await this.repo.save(event);
    } catch (err) {
      throw err;
    }
  }

  async registerExit(id: ParkingEventId) {
    await this.validateUserPermission(id);

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
      throw err;
    }
  }

  async findOneWithParkingLotAndVehicle(id: ParkingEventId) {
    try {
      const parkingEvent = await this.repo
        .createQueryBuilder('parkingEvent')
        .leftJoinAndSelect('parkingEvent.vehicle', 'vehicle')
        .leftJoinAndSelect('parkingEvent.parkingLot', 'parkingLot')
        .where('parkingEvent.id = :id', { id })
        .getOne();

      if (!parkingEvent) {
        throw new ParkingEventNotFoundException(id);
      }

      return parkingEvent;
    } catch (err) {
      throw err;
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

  async validateUserPermission(id: string): Promise<void> {
    const parkingEvent = await this.findOneWithParkingLotAndVehicle(id);
    const parkingLot = await this.parkingLotService.findOne(
      parkingEvent.parkingLot.id,
    );
    const { company } = parkingLot;

    if (company.id != this.user.sub) {
      throw new ForbiddenException();
    }
  }

  async validateIfParkingLotHasAvaliableSpots(
    id: string,
    vehicleType: DeepPartial<VehicleTypesEnum>,
  ) {
    const parkingLot = await this.parkingLotService.findOne(id);
    let availableSpots;

    switch (vehicleType) {
      case VehicleTypesEnum.car:
        availableSpots = parkingLot.avaliableCarSpots;
        break;
      case VehicleTypesEnum.motocycle:
        availableSpots = parkingLot.avaliableMotorcycleSpots;
        break;
    }

    if (availableSpots <= 0) {
      throw new ParkingEventWithConflict(
        `ParkingLot ${parkingLot.id} has no available ${vehicleType} spots`,
      );
    }
  }

  async validateUserPermissionByParkingLotId(id: string): Promise<void> {
    this.parkingLotService.user = this.user;
    await this.parkingLotService.validateUserPermission(id);
  }
}
