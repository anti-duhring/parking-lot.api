import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParkingLotNotFoundException } from '../../common/exceptions';
import { Company } from '../company/entity/company.entity';
import { CreateParkingLotDto } from './dtos/create-parking-lot.dto';
import { ParkingLot } from './entity/parking-lot.entity';
import { ParkingLotService } from './parking-lot.service';

describe('ParkingLotService', () => {
  let service: ParkingLotService;
  let repository: Repository<ParkingLot>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingLotService,
        { provide: getRepositoryToken(ParkingLot), useClass: Repository },
      ],
    }).compile();

    service = module.get<ParkingLotService>(ParkingLotService);
    repository = module.get<Repository<ParkingLot>>(
      getRepositoryToken(ParkingLot),
    );
  });

  describe('Create', () => {
    it('Should create a parking lot', () => {
      const company: Company = {
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
      const createParkingLotDto: CreateParkingLotDto = {
        car: 10,
        motocycle: 20,
        company,
      };
      const parkingLot: ParkingLot = {
        id: '1',
        company: company.id,
        totalCarSpots: createParkingLotDto.car,
        totalMotorcycleSpots: createParkingLotDto.motocycle,
        totalSpots: createParkingLotDto.car + createParkingLotDto.motocycle,
        occupiedSpots: [],
        parkingEvents: [],
      };

      jest.spyOn(repository, 'create').mockReturnValue(parkingLot);
      jest.spyOn(repository, 'save').mockResolvedValue(parkingLot);

      expect(service.create(createParkingLotDto)).resolves.toEqual(parkingLot);
    });
  });
  describe('Find', () => {
    it('Should find a parking lot', async () => {
      const parkingLot: ParkingLot = {
        id: '1',
        company: '1',
        totalCarSpots: 10,
        totalMotorcycleSpots: 10,
        totalSpots: 20,
        occupiedSpots: [],
        parkingEvents: [],
      };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(parkingLot);

      const result = await service.findOne(parkingLot.id);

      expect(result).toEqual(parkingLot);
    });
    it('Should throw an error if parking lot is not found', async () => {
      const id = '1';
      jest.spyOn(repository, 'findOneByOrFail').mockRejectedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        ParkingLotNotFoundException,
      );
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
    });
  });
  describe('Update', () => {
    it('Should update a parking lot', async () => {
      const parkingLot: ParkingLot = {
        id: '1',
        company: '1',
        totalCarSpots: 10,
        totalMotorcycleSpots: 10,
        totalSpots: 20,
        occupiedSpots: [],
        parkingEvents: [],
      };
      const updateParkingLotDto: UpdateParkingLotDto = {
        totalCarSpots: 15,
        totalMotorcycleSpots: 20,
      };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(parkingLot);
      jest.spyOn(repository, 'save').mockResolvedValue(parkingLot);
      const result = await service.update(parkingLot.id, updateParkingLotDto);

      expect(result.totalCarSpots).toEqual(15);
      expect(result.totalMotorcycleSpots).toEqual(20);
      expect(result.totalSpots).toEqual(35);
    });
    it('Should throw an error if parking lot is not found', async () => {
      const id = '1';
      const updateParkingLotDto: UpdateParkingLotDto = {
        totalCarSpots: 15,
        totalMotorcycleSpots: 20,
      };
      jest.spyOn(repository, 'findOneByOrFail').mockRejectedValue(null);

      await expect(
        service.update(id, updateParkingLotDto),
      ).rejects.toThrowError(ParkingLotNotFoundException);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
    });
  });
  describe('Delete', () => {
    it('Should delete a parking lot', async () => {
      const id = '1';
      const parkingLot: ParkingLot = {
        id,
        company: '1',
        totalCarSpots: 10,
        totalMotorcycleSpots: 10,
        totalSpots: 20,
        occupiedSpots: [],
        parkingEvents: [],
      };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(parkingLot);
      jest.spyOn(repository, 'softRemove').mockResolvedValue(parkingLot);

      const result = await service.remove(id);

      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(repository.softRemove).toHaveBeenCalledWith(parkingLot);
      expect(result).toEqual(parkingLot);
    });
    it('Should throw an error when a parking lot with the given id does not exist', async () => {
      const id = '1';

      jest.spyOn(repository, 'findOneByOrFail').mockRejectedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        ParkingLotNotFoundException,
      );
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
    });
  });
});
