import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('/:id')
  findOne(@Param('id') id: ParkingLotId) {
    return this.parkingLotService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: ParkingLotId,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ) {
    return this.parkingLotService.update(id, updateParkingLotDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: ParkingLotId) {
    return this.parkingLotService.remove(id);
  }
}
