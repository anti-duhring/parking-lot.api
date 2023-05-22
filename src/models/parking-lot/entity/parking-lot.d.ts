type ParkingLotId = string;
type UpdateParkingLotDto = Partial<
  Omit<ParkingLot, 'id' | 'parkingEvents' | 'occupiedSpots' | 'totalSpots'>
>;
