import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CompanyAlreadyExistsException,
  CompanyNotFoundException,
} from '../../common/exceptions';
import { Company } from './entity/company.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { ParkingLotService } from '../parking-lot/parking-lot.service';

@Injectable()
export default class CompanyService {
  constructor(
    @InjectRepository(Company) private repo: Repository<Company>,
    private readonly parkingLotService: ParkingLotService,
  ) {}

  async create(data: CreateCompanyDto) {
    const { name, cnpj, password, address, phone, parkingSpots } = data;
    const { car, motocycle } = parkingSpots;

    const companyWithSameCnpj = await this.repo.findOneBy({ cnpj });

    if (companyWithSameCnpj) {
      throw new CompanyAlreadyExistsException(cnpj);
    }

    let company = this.repo.create({
      name,
      cnpj,
      password,
      address,
      phone,
    });

    company = await this.repo.save(company);

    const parkingLot = await this.parkingLotService.create({
      company,
      car,
      motocycle,
    });
    delete parkingLot.company;

    Object.assign(company, { parkingLot });

    return this.repo.save(company);
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

      return company;
    } catch (err) {
      throw new CompanyNotFoundException(id);
    }
  }
  async update(id: CompanyId, data: UpdateCompanyDto) {
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
    const company = await this.findOne(id);
    await this.parkingLotService.remove(company.parkingLot.id);
    return await this.repo.softRemove(company);
  }
}
