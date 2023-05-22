import { HttpException, HttpStatus } from '@nestjs/common';

export class ParkingEventWithConflict extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
