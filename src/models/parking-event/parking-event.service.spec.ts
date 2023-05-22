import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ParkingEventNotFoundException,
  ParkingLotNotFoundException,
  VehicleExitAlreadyBeenRegisteredException,
  VehicleNotFoundException,
} from '../../common/exceptions';
import CompanyService from '../company/company.service';
import { Company } from '../company/entity/company.entity';
import { ParkingLot } from '../parking-lot/entity/parking-lot.entity';
import { ParkingLotService } from '../parking-lot/parking-lot.service';
import { Vehicle } from '../vehicle/entity/vehicle.entity';
import { VehicleService } from '../vehicle/vehicle.service';
import { RegisterVehicleEntryDto } from './dtos/create-parking-event.dto';
import { ParkingEvent } from './entity/parking-event.entity';
import { ParkingEventService } from './parking-event.service';
import { VehicleTypesEnum } from '../vehicle/dto/vehicle-type.dto';

describe('ParkingEventService', () => {
  let service: ParkingEventService;
  let repository: Repository<ParkingEvent>;

  let vehicleService: VehicleService;
  let vehicleRepository: Repository<Vehicle>;

  let parkingLotService: ParkingLotService;
  let parkingLotRepository: Repository<ParkingLot>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingEventService,
        VehicleService,
        CompanyService,
        ParkingLotService,
        { provide: getRepositoryToken(ParkingEvent), useClass: Repository },
        { provide: getRepositoryToken(Company), useClass: Repository },
        { provide: getRepositoryToken(Vehicle), useClass: Repository },
        { provide: getRepositoryToken(ParkingLot), useClass: Repository },
      ],
    }).compile();

    service = module.get<ParkingEventService>(ParkingEventService);
    repository = module.get<Repository<ParkingEvent>>(
      getRepositoryToken(ParkingEvent),
    );

    vehicleService = module.get<VehicleService>(VehicleService);
    vehicleRepository = module.get<Repository<Vehicle>>(
      getRepositoryToken(Vehicle),
    );

    parkingLotService = module.get<ParkingLotService>(ParkingLotService);
    parkingLotRepository = module.get<Repository<ParkingLot>>(
      getRepositoryToken(ParkingLot),
    );
  });

  describe('Register entry', () => {
    it('Should register new entry', async () => {
      const vehicle: Vehicle = {
        id: '1',
        brand: 'Ford',
        color: 'White',
        model: 'Fiesta',
        plate: 'ABC-1234',
        type: 'Car',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingEvents: [],
        company: null,
      };
      const parkingLot: ParkingLot = {
        id: '2',
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
      const entryDto: RegisterVehicleEntryDto = {
        vehicleId: '1',
        parkingLotId: '2',
        vehicleType: VehicleTypesEnum.car,
      };
      const parkingEvent: ParkingEvent = {
        id: '1',
        dateTimeEntry: new Date(),
        dateTimeExit: null,
        vehicleType: VehicleTypesEnum.car,
        parkingLot,
        vehicle,
      };

      jest.spyOn(vehicleService, 'findOne').mockResolvedValue(vehicle);

      jest.spyOn(parkingLotService, 'findOne').mockResolvedValue(parkingLot);
      jest
        .spyOn(parkingLotService, 'validateUserPermission')
        .mockResolvedValue();

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();

      jest.spyOn(repository, 'create').mockResolvedValue(parkingEvent as never);
      jest.spyOn(repository, 'save').mockResolvedValue(parkingEvent);

      const result = await service.registerEntry(entryDto);

      expect(vehicleService.findOne).toHaveBeenCalledWith(entryDto.vehicleId);
      expect(parkingLotService.findOne).toHaveBeenCalledWith(
        entryDto.parkingLotId,
      );
      expect(repository.create).toHaveBeenCalledWith({
        vehicle,
        parkingLot,
        dateTimeEntry: expect.any(Date),
        vehicleType: VehicleTypesEnum.car,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(parkingEvent);
    });
  });
  describe('Register exit', () => {
    it('Should register new exit', async () => {
      const parkingEvent: ParkingEvent = {
        id: '1',
        vehicle: null,
        vehicleType: VehicleTypesEnum.car,
        parkingLot: null,
        dateTimeEntry: new Date(),
        dateTimeExit: null,
      };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(parkingEvent);
      jest.spyOn(repository, 'save').mockResolvedValue(parkingEvent);

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();

      const result = await service.registerExit(parkingEvent.id);
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({
        id: parkingEvent.id,
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...parkingEvent,
        dateTimeExit: expect.any(Date),
      });

      expect(result.dateTimeExit).toEqual(expect.any(Date));
    });
    it('Should throw error when parking event is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(() => {
        throw new ParkingEventNotFoundException('');
      });

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();

      await expect(service.registerExit('1')).rejects.toThrow(
        ParkingEventNotFoundException,
      );
    });
    it('Should throw error when exit is already registered', async () => {
      const parkingEvent: ParkingEvent = {
        id: '1',
        vehicle: null,
        vehicleType: VehicleTypesEnum.car,
        parkingLot: null,
        dateTimeEntry: new Date(),
        dateTimeExit: new Date(),
      };

      jest.spyOn(service, 'validateUserPermission').mockResolvedValue();

      jest.spyOn(service, 'findOne').mockResolvedValue(parkingEvent);

      await expect(service.registerExit('1')).rejects.toThrow(
        VehicleExitAlreadyBeenRegisteredException,
      );
    });
  });
});
