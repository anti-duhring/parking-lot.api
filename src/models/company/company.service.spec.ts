import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CompanyAlreadyExistsException,
  CompanyNotFoundException,
} from '../../common/exceptions';
import { ParkingLotService } from '../parking-lot/parking-lot.service';
import CompanyService from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { Company } from './entity/company.entity';
import { ParkingLot } from '../parking-lot/entity/parking-lot.entity';

describe('CompanyService', () => {
  let service: CompanyService;
  let parkingLotService: ParkingLotService;
  let repository: Repository<Company>;
  let parkingLotRepository: Repository<ParkingLot>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        ParkingLotService,
        { provide: getRepositoryToken(Company), useClass: Repository },
        { provide: getRepositoryToken(ParkingLot), useClass: Repository },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
    parkingLotService = module.get<ParkingLotService>(ParkingLotService);
    parkingLotRepository = module.get<Repository<ParkingLot>>(
      getRepositoryToken(ParkingLot),
    );
  });

  describe('Create', () => {
    it('Should create a new company', async () => {
      const companyDto: CreateCompanyDto = {
        name: 'Company A',
        cnpj: '123456789',
        password: 'password',
        address: '123 Street',
        phone: '1234567890',
        parkingSpots: {
          car: 10,
          motocycle: 10,
        },
      };
      const parkingLot: ParkingLot = {
        id: '1',
        company: null,
        totalCarSpots: 10,
        totalMotorcycleSpots: 10,
        totalSpots: 20,
        parkingEvents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        avaliableCarSpots: 10,
        avaliableMotorcycleSpots: 10,
        totalAvaliableSpots: 20,
      };

      const { name, cnpj, password, address, phone, parkingSpots } = companyDto;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(companyDto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(companyDto as any);

      jest.spyOn(parkingLotRepository, 'create').mockReturnValue(parkingLot);
      jest
        .spyOn(parkingLotRepository, 'save')
        .mockReturnValue(parkingLot as any);

      const result = await service.create(companyDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        cnpj: companyDto.cnpj,
      });
      expect(repository.create).toHaveBeenCalledWith({
        name,
        cnpj,
        password,
        address,
        phone,
      });
      expect(repository.save).toHaveBeenCalledWith({
        name,
        cnpj,
        password,
        address,
        phone,
        parkingSpots,
        parkingLot,
      });
      expect(result).toEqual({
        name,
        cnpj,
        password,
        address,
        phone,
        parkingSpots,
        parkingLot,
      });
    });
    it('Should throw CompanyAlreadyExistsException when a company with the same cnpj already exists', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Company B',
        cnpj: '123456789',
        password: 'password',
        address: '456 Street',
        phone: '9876543210',
        parkingSpots: {
          car: 10,
          motocycle: 10,
        },
      };

      const existingCompany: Company = {
        id: '1',
        name: 'Company A',
        cnpj: '123456789',
        password: 'password',
        address: '123 Street',
        phone: '1234567890',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
        parkingLot: null,
        vehicles: [],
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingCompany);

      await expect(service.create(createCompanyDto)).rejects.toThrowError(
        CompanyAlreadyExistsException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        cnpj: createCompanyDto.cnpj,
      });
    });
  });
  describe('Find', () => {
    it('Should find a company by id', async () => {
      const id = '1';
      const company: Company = {
        id,
        name: 'Company A',
        cnpj: '123456789',
        password: 'XXXXXXXX',
        address: '123 Street',
        phone: '1234567890',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
        parkingLot: null,
        vehicles: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(company);

      const result = await service.findOne(id);

      expect(result).toEqual(company);
    });
    it('Should throw CompanyNotFoundException when a company with the given id does not exist', async () => {
      const id = '1';

      jest.spyOn(service, 'findOne').mockRejectedValue(() => {
        throw new CompanyNotFoundException(id);
      });

      await expect(service.findOne(id)).rejects.toThrowError(
        CompanyNotFoundException,
      );
    });
  });
  describe('Update', () => {
    it('Should update a company', async () => {
      const id = '1';
      const company: Company = {
        id,
        name: 'Company A',
        cnpj: '123456789',
        password: 'XXXXXXXX',
        address: '123 Street',
        phone: '1234567890',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
        parkingLot: null,
        vehicles: [],
      };
      const companyUpdated: UpdateCompanyDto = {
        name: 'Company B',
        cnpj: '123456781',
        address: '321 Street',
        phone: '1234567891',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(company);

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();
      jest.spyOn(service, 'findOne').mockResolvedValue(company);

      const result = await service.update(id, company);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(Object.assign(company, companyUpdated));
    });
    it('Should throw CompanyAlreadyExistsException when a company with the same cnpj already exists', async () => {
      const id = '1';
      const company: Company = {
        id: '2',
        name: 'Company A',
        cnpj: '123456781',
        password: 'XXXXXXXX',
        address: '123 Street',
        phone: '1234567890',
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
        parkingLot: null,
        vehicles: [],
      };
      const companyUpdated: UpdateCompanyDto = {
        name: 'Company B',
        cnpj: '123456781',
        address: '321 Street',
        phone: '1234567891',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(company);
      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();

      await expect(service.update(id, companyUpdated)).rejects.toThrowError(
        CompanyAlreadyExistsException,
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({
        cnpj: companyUpdated.cnpj,
      });
    });
  });

  describe('Delete', () => {
    it('Should delete a company', async () => {
      const id = '1';
      const company: Company = {
        id,
        name: 'Company A',
        cnpj: '123456789',
        password: 'XXXXXXXX',
        address: '123 Street',
        phone: '1234567890',
        parkingLot: {
          id: '1',
          company: null,
          totalCarSpots: 10,
          totalMotorcycleSpots: 10,
          totalSpots: 20,
          parkingEvents: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          avaliableCarSpots: 10,
          avaliableMotorcycleSpots: 10,
          totalAvaliableSpots: 20,
        },
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
        vehicles: [],
      };

      jest.spyOn(repository, 'softRemove').mockResolvedValue(company);

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();
      jest.spyOn(service, 'findOne').mockResolvedValue(company);

      jest
        .spyOn(parkingLotService, 'findOne')
        .mockResolvedValue(company.parkingLot);

      jest
        .spyOn(parkingLotService, 'validateUserPermission')
        .mockResolvedValue();

      jest
        .spyOn(parkingLotRepository, 'softRemove')
        .mockResolvedValue(company.parkingLot);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.softRemove).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });
    it('Should throw CompanyNotFoundException when a company with the given id does not exist', async () => {
      const id = '1';

      jest.spyOn(service, 'findOne').mockRejectedValue(() => {
        throw new CompanyNotFoundException(id);
      });

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();

      await expect(service.remove(id)).rejects.toThrowError(
        CompanyNotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
