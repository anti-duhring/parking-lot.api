import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { VehicleService } from './vehicle.service';
import { CompanyModule } from '../company/company.module';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), CompanyModule],
  providers: [VehicleService],
  exports: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
