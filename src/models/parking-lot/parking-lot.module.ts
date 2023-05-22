import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLot } from './entity/parking-lot.entity';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import CompanyService from '../company/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot])],
  providers: [ParkingLotService],
  controllers: [ParkingLotController],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}
