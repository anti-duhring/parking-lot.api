import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingLot } from './entity/parking-lot.entity';
import { CreateParkingLotDto } from './dtos/create-parking-lot.dto';
import { ParkingLotNotFoundException } from '../../common/exceptions';
import CompanyService from '../company/company.service';

@Injectable()
export class ParkingLotService {
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

    return this.repo.save(parkingLot);
  }

  async findOne(id: ParkingLotId) {
    try {
      const parkingLot = await this.repo
        .createQueryBuilder('parkingLot')
        .leftJoinAndSelect('parkingLot.company', 'company')
        .leftJoinAndSelect('parkingLot.parkingEvents', 'parkingEvent')
        .where('parkingLot.id = :id', { id })
        .getOne();

      if (!parkingLot) {
        throw new ParkingLotNotFoundException(id);
      }
      return parkingLot;
    } catch (err) {
      throw new ParkingLotNotFoundException(id);
    }
  }

  async update(id: ParkingLotId, parkingLotDto: UpdateParkingLotDto) {
    const parkingLot = await this.findOne(id);
    Object.assign(parkingLot, parkingLotDto);

    parkingLot.totalSpots =
      parkingLot.totalCarSpots + parkingLot.totalMotorcycleSpots;

    return this.repo.save(parkingLot);
  }

  async remove(id: ParkingLotId) {
    const parkingLot = await this.findOne(id);
    return await this.repo.softRemove(parkingLot);
  }
}
