import Company from '@company/entity/company.entity';
import ParkingEvent from 'src/models/parking-event/entity/parking-event.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export default class ParkingSpot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Company, (company) => company.parkingSpot)
  @JoinColumn()
  company: string;

  @Column()
  name: string;

  @Column()
  totalCarSpots: number;

  @Column()
  totalMotorcycleSpots: number;

  @Column()
  totalSpots: number;

  @Column()
  totalOccupiedCarSpots: number;

  @Column()
  totalOccupiedMotorcycleSpots: number;

  @Column()
  totalOccupiedSpots: number;

  @Column()
  totalAvailableCarSpots: number;

  @Column()
  totalAvailableMotorcycleSpots: number;

  @Column()
  totalAvailableSpots: number;

  @OneToMany(() => ParkingEvent, (parkingEvent) => parkingEvent.parkingSpot)
  parkingEvent: ParkingEvent[];
}
