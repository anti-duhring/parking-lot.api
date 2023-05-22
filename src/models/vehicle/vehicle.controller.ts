import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('vehicle')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @UseGuards(AuthGuard)
  @Post()
  createVehicle(@Body() createVehicleDto: CreateVehicleDto, @Req() req: any) {
    try {
      const { user } = req;
      this.vehicleService.user = user;

      return this.vehicleService.create(createVehicleDto);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateVehicle(
    @Param('id') id: VehicleId,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Req() req: any,
  ) {
    try {
      const { user } = req;
      this.vehicleService.user = user;

      return this.vehicleService.update(id, updateVehicleDto);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: VehicleId, @Req() req: any) {
    try {
      const { user } = req;
      this.vehicleService.user = user;

      return this.vehicleService.findOne(id);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: VehicleId, @Req() req: any) {
    try {
      const { user } = req;
      this.vehicleService.user = user;

      return this.vehicleService.remove(id);
    } catch (error) {
      console.error(error);
    }
  }
}
