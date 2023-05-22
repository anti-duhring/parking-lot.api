import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ParkingEventService } from './parking-event.service';
import { RegisterVehicleEntryDto } from './dtos/create-parking-event.dto';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('parking-event')
export class ParkingEventController {
  constructor(private parkingEventService: ParkingEventService) {}

  @UseGuards(AuthGuard)
  @Post('/entry')
  registerEntry(
    @Body() registerVehicleEntryDto: RegisterVehicleEntryDto,
    @Req() req: any,
  ) {
    const { user } = req;
    this.parkingEventService.user = user;

    return this.parkingEventService.registerEntry(registerVehicleEntryDto);
  }

  @UseGuards(AuthGuard)
  @Put('/exit/:id')
  registerExit(@Param('id') id: ParkingEventId, @Req() req: any) {
    const { user } = req;
    this.parkingEventService.user = user;

    return this.parkingEventService.registerExit(id);
  }
}
