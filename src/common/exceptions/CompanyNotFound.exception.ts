import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNotFoundException extends HttpException {
  constructor(cnpj: string) {
    super(`Company ${cnpj} not found`, HttpStatus.NOT_FOUND);
  }
}
