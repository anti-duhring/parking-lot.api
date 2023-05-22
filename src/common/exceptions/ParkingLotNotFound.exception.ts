import { HttpException, HttpStatus } from '@nestjs/common';

export class ParkingLotNotFoundException extends HttpException {
  constructor(id: ParkingLotId) {
    super(`ParkingLot ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
