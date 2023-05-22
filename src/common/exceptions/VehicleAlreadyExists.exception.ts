import { HttpException, HttpStatus } from '@nestjs/common';

export class VehicleAlreadyExistsException extends HttpException {
  constructor(plate: string) {
    super(`Vehicle with plate ${plate} already exists`, HttpStatus.CONFLICT);
  }
}
