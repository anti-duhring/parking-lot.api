import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import CompanyService from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { ParkingLotModule } from '../parking-lot/parking-lot.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), ParkingLotModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
