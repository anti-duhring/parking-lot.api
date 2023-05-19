import Company from '@company/entity/company.entity';
import ParkingEvent from 'src/models/parking-event/entity/parking-event.entity';
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
export default class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, (company) => company.id)
  @JoinColumn()
  company: string;

  @OneToMany(() => ParkingEvent, (parkingEvent) => parkingEvent.vehicle)
  @JoinColumn()
  parkingEvent: ParkingEvent[];

  @Column()
  model: string;

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
