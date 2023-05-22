import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './models/company/company.module';
import { Company } from './models/company/entity/company.entity';
import { ParkingLot } from './models/parking-lot/entity/parking-lot.entity';
import { Vehicle } from './models/vehicle/entity/vehicle.entity';
import { ParkingEvent } from './models/parking-event/entity/parking-event.entity';
import { VehicleModule } from './models/vehicle/vehicle.module';
import { ParkingLotModule } from './models/parking-lot/parking-lot.module';
import { ParkingEventModule } from './models/parking-event/parking-event.module';

dotenv.config();

@Module({
  imports: [
    CompanyModule,
    AuthModule,
    VehicleModule,
    ParkingLotModule,
    ParkingEventModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Company, ParkingLot, Vehicle, ParkingEvent],
      synchronize: true,
      dropSchema: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
