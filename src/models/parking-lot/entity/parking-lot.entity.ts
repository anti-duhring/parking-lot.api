// import Company from '@company/entity/company.entity';

import { Company } from '../../company/entity/company.entity';
import { ParkingEvent } from '../../parking-event/entity/parking-event.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'parking_lot' })
export class ParkingLot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Company, (company) => company.parkingLot)
  @JoinColumn()
  company: Company;

  @Column()
  totalCarSpots: number;

  @Column()
  totalMotorcycleSpots: number;

  @Column()
  totalSpots: number;

  @OneToMany(() => ParkingEvent, (parkingEvent) => parkingEvent.parkingLot)
  parkingEvents: ParkingEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  occupiedSpots: ParkingEvent[];
}
