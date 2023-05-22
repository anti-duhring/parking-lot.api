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
import { ServiceWithAuth } from '../../common/interfaces/service-with-auth.interface';

@Injectable()
export class VehicleService implements ServiceWithAuth {
  user: CompanyUser;

  constructor(
    @InjectRepository(Vehicle) private repo: Repository<Vehicle>,
    private companyService: CompanyService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const { companyId, brand, color, model, plate, type } = createVehicleDto;

    await this.validateIfVehicleWithSamePlateAlreadyExists(plate);
    await this.validateUserPermissionByCompanyId(companyId);

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

      return vehicle;
    } catch (err) {
      throw new VehicleNotFoundException(id);
    }
  }

  async update(id: VehicleId, updateVehicleDto: UpdateVehicleDto) {
    await this.validateUserPermission(id);

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
    await this.validateUserPermission(id);

    const vehicle = await this.findOne(id);

    return await this.repo.softRemove(vehicle);
  }

  private async validateIfVehicleWithSamePlateAlreadyExists(plate: string) {
    const vehicle = await this.repo.findOneBy({ plate });

    if (vehicle) {
      throw new VehicleAlreadyExistsException(plate);
    }
  }

  async validateUserPermission(id: string): Promise<void> {
    const vehicle = await this.findOne(id);

    if (vehicle.company.id != this.user.sub) {
      throw new ForbiddenException();
    }
  }
  async validateUserPermissionByCompanyId(id: string) {
    this.companyService.user = this.user;
    await this.companyService.validateUserPermission(id);
  }
}
