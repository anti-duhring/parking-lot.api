import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ParkingEventService } from './parking-event.service';
import { RegisterVehicleEntryDto } from './dtos/create-parking-event.dto';

@Controller('parking-event')
export class ParkingEventController {
  constructor(private parkingEventService: ParkingEventService) {}

  @Post('/entry')
  registerEntry(@Body() registerVehicleEntryDto: RegisterVehicleEntryDto) {
    return this.parkingEventService.registerEntry(registerVehicleEntryDto);
  }

  @Put('/exit/:id')
  registerExit(@Param('id') id: ParkingEventId) {
    return this.parkingEventService.registerExit(id);
  }
}
