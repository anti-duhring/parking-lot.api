// import ParkingLot from '@parking-lot/entity/parking-lot.entity';
// import Vehicle from '@vehicle/entity/vehicle.entity';

import { Vehicle } from '../../vehicle/entity/vehicle.entity';
import { ParkingLot } from '../../parking-lot/entity/parking-lot.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parking_events' })
export class ParkingEvent {
  @PrimaryGeneratedColumn('uuid')
  id: ParkingEventId;

  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.parkingEvents)
  parkingLot: ParkingLot;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.parkingEvents)
  vehicle: Vehicle;

  @Column()
  dateTimeEntry: Date;

  @Column({ default: null })
  dateTimeExit: Date;
}
