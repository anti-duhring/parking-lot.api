import ParkingSpot from '@parking-spot/entity/parking-spot.entity';
import Vehicle from 'src/models/vehicle/entity/vehicle.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export default class ParkingEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ParkingSpot, (spot) => spot.parkingEvent)
  parkingSpot: ParkingSpot;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.parkingEvent)
  vehicle: Vehicle;

  @Column()
  dateTimeEntry: Date;

  @Column({ default: null })
  dateTimeExit: Date;
}
