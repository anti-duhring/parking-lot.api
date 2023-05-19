import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import CreateCompanyDto from './dtos/create-company.dto';
import CompanyService from './company.service';

@Controller('company')
export class CompanyController {
  constructor(public companyService: CompanyService) {}

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    console.log(createCompanyDto);
    return createCompanyDto;
  }

  @Get('/:id')
  getCompanyById(@Param('id') id: string) {
    return `company with id ${id}`;
  }
}
