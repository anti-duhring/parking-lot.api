import { HttpException, HttpStatus } from '@nestjs/common';

export class VehicleNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Vehicle ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
