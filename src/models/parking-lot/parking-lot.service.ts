import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParkingLotNotFoundException } from '../../common/exceptions';
import { CreateParkingLotDto } from './dtos/create-parking-lot.dto';
import { ParkingLot } from './entity/parking-lot.entity';
import { ServiceWithAuth } from '../../common/interfaces/service-with-auth.interface';
import { VehicleTypesEnum } from '../vehicle/dto/vehicle-type.dto';

@Injectable()
export class ParkingLotService implements ServiceWithAuth {
  user: CompanyUser;

  constructor(
    @InjectRepository(ParkingLot)
    private readonly repo: Repository<ParkingLot>,
  ) {}

  async create(parkingLotDto: CreateParkingLotDto): Promise<ParkingLot> {
    const { company, car, motocycle } = parkingLotDto;
    const parkingLot = this.repo.create({
      company,
      totalCarSpots: car,
      totalMotorcycleSpots: motocycle,
      totalSpots: car + motocycle,
    });

    return await this.repo.save(parkingLot);
  }

  async findOne(id: ParkingLotId) {
    try {
      let parkingLot = await this.repo
        .createQueryBuilder('parkingLot')
        .leftJoinAndSelect('parkingLot.company', 'company')
        .leftJoinAndSelect('parkingLot.parkingEvents', 'parkingEvent')
        .where('parkingLot.id = :id', { id })
        .getOne();

      if (!parkingLot) {
        throw new ParkingLotNotFoundException(id);
      }

      parkingLot = this.addAvaliableSpots(parkingLot);

      return parkingLot;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(id: ParkingLotId, parkingLotDto: UpdateParkingLotDto) {
    await this.validateUserPermission(id);

    const parkingLot = await this.findOne(id);
    Object.assign(parkingLot, parkingLotDto);

    parkingLot.totalSpots =
      parkingLot.totalCarSpots + parkingLot.totalMotorcycleSpots;

    return this.repo.save(parkingLot);
  }

  async remove(id: ParkingLotId) {
    await this.validateUserPermission(id);

    const parkingLot = await this.findOne(id);
    return await this.repo.softRemove(parkingLot);
  }

  async validateUserPermission(id: string): Promise<void> {
    const parkingLot = await this.findOne(id);
    const { company } = parkingLot;

    if (company.id !== this.user.sub) {
      throw new ForbiddenException();
    }
  }

  private addAvaliableSpots(parkingLot: ParkingLot) {
    // eslint-disable-next-line prefer-const
    let { parkingEvents, totalCarSpots, totalMotorcycleSpots } = parkingLot;

    parkingEvents = parkingEvents.filter((event) => !event.dateTimeExit);

    const carEvents = parkingEvents.filter(
      (event) => event.vehicleType === VehicleTypesEnum.car,
    );
    const motocycleEvents = parkingEvents.filter(
      (event) => event.vehicleType === VehicleTypesEnum.motocycle,
    );

    parkingLot.avaliableCarSpots = totalCarSpots - carEvents.length;
    parkingLot.avaliableMotorcycleSpots =
      totalMotorcycleSpots - motocycleEvents.length;
    parkingLot.totalAvaliableSpots =
      parkingLot.avaliableCarSpots + parkingLot.avaliableMotorcycleSpots;
    parkingLot.parkingEvents = parkingEvents;

    return parkingLot;
  }
}
