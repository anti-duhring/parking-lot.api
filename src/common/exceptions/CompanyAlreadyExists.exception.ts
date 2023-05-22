import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyAlreadyExistsException extends HttpException {
  constructor(cnpj: string) {
    super(`Company ${cnpj} already exists`, HttpStatus.CONFLICT);
  }
}
