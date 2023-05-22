import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  Delete,
} from '@nestjs/common';

import CompanyService from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get('/:id')
  findOne(@Param('id') id: CompanyId) {
    return this.companyService.findOne(id);
  }

  @Put('/:id')
  updateCompany(
    @Param('id') id: CompanyId,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete('/:id')
  removeCompany(@Param('id') id: CompanyId) {
    return this.companyService.remove(id);
  }
}
