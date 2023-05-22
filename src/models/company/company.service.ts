import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CompanyAlreadyExistsException,
  CompanyNotFoundException,
} from '../../common/exceptions';
import { ServiceWithAuth } from '../../common/interfaces/service-with-auth.interface';
import { ParkingLotService } from '../parking-lot/parking-lot.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { Company } from './entity/company.entity';

@Injectable()
export default class CompanyService implements ServiceWithAuth {
  user: CompanyUser;

  constructor(
    @InjectRepository(Company) private repo: Repository<Company>,
    private readonly parkingLotService: ParkingLotService,
  ) {}

  async create(data: CreateCompanyDto) {
    const { name, cnpj, password, address, phone, parkingSpots } = data;
    const { car, motocycle } = parkingSpots;

    await this.validateIfACompanyWithGivenCnpjExists(cnpj);

    const company = this.repo.create({
      name,
      cnpj,
      password,
      address,
      phone,
    });

    await this.repo.save(company);

    company.parkingLot = await this.parkingLotService.create({
      company,
      car,
      motocycle,
    });

    delete company.parkingLot.company;

    return company;
  }

  async findOne(id: CompanyId) {
    try {
      const company = await this.repo
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.parkingLot', 'parkingLot')
        .where('company.id = :id', { id })
        .getOne();

      if (!company) {
        throw new CompanyNotFoundException(id);
      }

      delete company.password;

      return company;
    } catch (err) {
      throw err;
    }
  }

  async findOneByCnpj(cnpj: string) {
    try {
      const company = await this.repo
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.parkingLot', 'parkingLot')
        .where('company.cnpj = :cnpj', { cnpj })
        .getOne();

      if (!company) {
        throw new CompanyNotFoundException(cnpj);
      }

      return company;
    } catch (err) {
      throw err;
    }
  }

  async update(id: CompanyId, data: UpdateCompanyDto) {
    this.validateUserPermission(id);

    if (data.hasOwnProperty('cnpj')) {
      const { cnpj } = data;

      const companyWithSameCnpj = await this.repo.findOneBy({ cnpj });

      if (companyWithSameCnpj) {
        throw new CompanyAlreadyExistsException(cnpj);
      }
    }

    const company = await this.findOne(id);
    Object.assign(company, data);

    return this.repo.save(company);
  }

  async remove(id: CompanyId) {
    this.validateUserPermission(id);

    const company = await this.findOne(id);
    await this.parkingLotService.remove(company.parkingLot.id);
    return await this.repo.softRemove(company);
  }

  async validateIfACompanyWithGivenCnpjExists(cnpj: string) {
    const company = await this.repo.findOneBy({ cnpj });

    if (company) {
      throw new CompanyAlreadyExistsException(cnpj);
    }
  }

  validateUserPermission(id: string): void | Promise<void> {
    if (id != this.user.sub) {
      throw new ForbiddenException();
    }
  }
}
