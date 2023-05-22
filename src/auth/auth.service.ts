import { Injectable } from '@nestjs/common';
import CompanyService from '../models/company/company.service';
import { CreateCompanyDto } from 'src/models/company/dtos/create-company.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInDto } from './dto/sign-in.dto';
import { InvalidCredentialsException } from '../common/exceptions';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) {}

  async signup(createCompanyDto: CreateCompanyDto) {
    createCompanyDto.password = await this.hashPassword(
      createCompanyDto.password,
    );
    const { password, ...company } = await this.companyService.create(
      createCompanyDto,
    );

    return {
      company,
      accessToken: await this.generateToken(company.cnpj, company.id),
    };
  }

  async signin(signInDto: SignInDto) {
    const { password, ...company } = await this.companyService.findOneByCnpj(
      signInDto.cnpj,
    );

    const [salt, storedHash] = password.split('.');
    const isValid = await this.comparePassword({
      password: signInDto.password,
      salt,
      storedHash,
    });

    if (!isValid) {
      throw new InvalidCredentialsException();
    }

    return {
      company,
      accessToken: await this.generateToken(company.cnpj, company.id),
    };
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    return salt + '.' + hash.toString('hex');
  }

  async comparePassword({
    password,
    salt,
    storedHash,
  }: {
    password: string;
    salt: string;
    storedHash: string;
  }) {
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    return storedHash === hash.toString('hex');
  }

  async generateToken(cnpj: string, id: CompanyId) {
    return await this.jwtService.signAsync({ username: cnpj, sub: id });
  }
}
