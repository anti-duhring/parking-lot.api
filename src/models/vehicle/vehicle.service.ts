import { Injectable, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import CompanyService from '../company/company.service';
import {
  VehicleAlreadyExistsException,
  VehicleNotFoundException,
} from '../../common/exceptions';

@Injectable()
export class VehicleService {
  user: CompanyUser;

  constructor(
    @InjectRepository(Vehicle) private repo: Repository<Vehicle>,
    private companyService: CompanyService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const { companyId, brand, color, model, plate, type } = createVehicleDto;

    await this.validateIfVehicleWithSamePlateAlreadyExists(plate);
    this.validIfCompanyIsTheUserCompany(companyId);

    const company = await this.companyService.findOne(companyId);
    const vehicle = this.repo.create({
      company,
      brand,
      color,
      model,
      plate,
      type,
    });

    return await this.repo.save(vehicle);
  }

  async findOne(id: VehicleId) {
    try {
      const vehicle = await this.repo
        .createQueryBuilder('vehicle')
        .leftJoinAndSelect('vehicle.company', 'company')
        .leftJoinAndSelect('vehicle.parkingEvents', 'parkingEvent')
        .where('vehicle.id = :id', { id })
        .getOne();

      if (!vehicle) {
        throw new VehicleNotFoundException(id);
      }

      await this.validateIfVehicleBelongsToCompany(vehicle.id);

      return vehicle;
    } catch (err) {
      throw new VehicleNotFoundException(id);
    }
  }

  async update(id: VehicleId, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    if (updateVehicleDto.hasOwnProperty('companyId')) {
      const company = await this.companyService.findOne(
        updateVehicleDto.companyId,
      );

      vehicle.company = company;
    }

    if (updateVehicleDto.hasOwnProperty('plate')) {
      await this.validateIfVehicleWithSamePlateAlreadyExists(
        updateVehicleDto.plate,
      );
    }

    Object.assign(vehicle, updateVehicleDto);

    return await this.repo.save(vehicle);
  }

  async remove(id: VehicleId) {
    await this.validateIfVehicleBelongsToCompany(id);

    const vehicle = await this.findOne(id);

    return await this.repo.softRemove(vehicle);
  }

  private async validateIfVehicleWithSamePlateAlreadyExists(plate: string) {
    const vehicle = await this.repo.findOneBy({ plate });

    if (vehicle) {
      throw new VehicleAlreadyExistsException(plate);
    }
  }

  private async validateIfVehicleBelongsToCompany(vehicleId: VehicleId) {
    const vehicle = await this.findOne(vehicleId);

    if (vehicle.company.id != this.user.sub) {
      throw new ForbiddenException();
    }
  }

  private validIfCompanyIsTheUserCompany(companyId: CompanyId) {
    if (companyId != this.user.sub) {
      throw new ForbiddenException();
    }
  }
}
