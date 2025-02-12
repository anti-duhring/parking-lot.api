// import Company from '@company/entity/company.entity';
// import ParkingEvent from '@parking-event/entity/parking-event.entity';

import { Company } from '../../company/entity/company.entity';
import { ParkingEvent } from '../../parking-event/entity/parking-event.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: VehicleId;

  @ManyToOne(() => Company, (company) => company.vehicles)
  @JoinColumn()
  company: Company;

  @OneToMany(() => ParkingEvent, (parkingEvent) => parkingEvent.vehicle)
  @JoinColumn()
  parkingEvents: ParkingEvent[];

  @Column()
  model: string;

  @Column()
  brand: string;

  @Column()
  color: string;

  @Column()
  plate: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
