import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: ParkingLotId, @Req() req: any) {
    try {
      const { user } = req;
      this.parkingLotService.user = user;

      return this.parkingLotService.findOne(id);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  update(
    @Param('id') id: ParkingLotId,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
    @Req() req: any,
  ) {
    try {
      const { user } = req;
      this.parkingLotService.user = user;

      return this.parkingLotService.update(id, updateParkingLotDto);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: ParkingLotId, @Req() req: any) {
    try {
      const { user } = req;
      this.parkingLotService.user = user;

      return this.parkingLotService.remove(id);
    } catch (error) {
      console.error(error);
    }
  }
}
