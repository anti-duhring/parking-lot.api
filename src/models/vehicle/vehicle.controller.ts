import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Post()
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Put('/:id')
  updateVehicle(
    @Param('id') id: VehicleId,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Get('/:id')
  findOne(@Param('id') id: VehicleId) {
    return this.vehicleService.findOne(id);
  }

  @Delete('/:id')
  remove(@Param('id') id: VehicleId) {
    return this.vehicleService.remove(id);
  }
}
