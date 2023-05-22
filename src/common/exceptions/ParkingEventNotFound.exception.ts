import { HttpException, HttpStatus } from '@nestjs/common';

export class ParkingEventNotFoundException extends HttpException {
  constructor(id: ParkingEventId) {
    super(`Parking event with id ${id} was not found`, HttpStatus.NOT_FOUND);
  }
}
