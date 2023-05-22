import { HttpException, HttpStatus } from '@nestjs/common';

export class VehicleExitAlreadyBeenRegisteredException extends HttpException {
  constructor(id: ParkingEventId) {
    super(
      `Vehicle exit from parking event ${id} was already been registered`,
      HttpStatus.CONFLICT,
    );
  }
}
