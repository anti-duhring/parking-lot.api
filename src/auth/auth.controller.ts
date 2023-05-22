import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from 'src/models/company/dtos/create-company.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  create(@Body() body: CreateCompanyDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  login(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }
}
