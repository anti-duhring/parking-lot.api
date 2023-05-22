// import ParkingLot from '@parking-lot/entity/parking-lot.entity';
// import Vehicle from '@vehicle/entity/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { ParkingLot } from '../../parking-lot/entity/parking-lot.entity';
import { Vehicle } from '../../vehicle/entity/vehicle.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: CompanyId;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToOne(() => ParkingLot, (parkingLot) => parkingLot.company)
  @JoinColumn()
  parkingLot: ParkingLot;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.company)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
