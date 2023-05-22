import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CompanyModule } from '../models/company/company.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [CompanyModule],
})
export class AuthModule {}
