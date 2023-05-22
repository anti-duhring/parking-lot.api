import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CompanyModule } from '../models/company/company.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    CompanyModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
