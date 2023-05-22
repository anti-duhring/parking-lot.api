import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../../auth/auth.guard';
import CompanyService from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: CompanyId, @Req() req: any) {
    const { user } = req;
    this.companyService.user = user;

    return this.companyService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateCompany(
    @Param('id') id: CompanyId,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: any,
  ) {
    const { user } = req;
    this.companyService.user = user;

    return this.companyService.update(id, updateCompanyDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  removeCompany(@Param('id') id: CompanyId, @Req() req: any) {
    const { user } = req;
    this.companyService.user = user;

    return this.companyService.remove(id);
  }
}
