import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import CompanyService from '../models/company/company.service';
import { Company } from '../models/company/entity/company.entity';
import { ParkingLot } from '../models/parking-lot/entity/parking-lot.entity';
import { ParkingLotService } from '../models/parking-lot/parking-lot.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateCompanyDto } from '../models/company/dtos/create-company.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InvalidCredentialsException } from '../common/exceptions';

describe('AuthService', () => {
  let service: AuthService;

  let companyService: CompanyService;
  let companyRepository: Repository<Company>;

  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CompanyService,
        ParkingLotService,
        JwtService,
        { provide: getRepositoryToken(Company), useClass: Repository },
        { provide: getRepositoryToken(ParkingLot), useClass: Repository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    companyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );

    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Signup', () => {
    it('Should create a new company and return it with token', async () => {
      const companyDto: CreateCompanyDto = {
        name: 'Company',
        cnpj: '11111111111',
        password: 'XXXXXX',
        address: 'Street test',
        phone: '11111111111',
        parkingSpots: {
          car: 40,
          motocycle: 50,
        },
      };
      const company: Company = {
        ...companyDto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingLot: null,
        vehicles: [],
      };

      const { password, ...companyWithoutPassword } = company;

      jest.spyOn(companyService, 'create').mockResolvedValue(company);
      jest.spyOn(service, 'generateToken').mockResolvedValue('access_token');

      const result = await service.signup(companyDto);

      expect(companyService.create).toHaveBeenCalledWith(companyDto);
      expect(service.generateToken).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result.company).toEqual(
        expect.objectContaining({
          ...companyWithoutPassword,
        }),
      );
      expect(result.accessToken).toBe('access_token');
    });
  });
  describe('Signin', () => {
    it('should sign in a company and return company data with access token', async () => {
      const signInDto: SignInDto = {
        cnpj: '11111111111',
        password: 'XXXXXX',
      };
      const company: Company = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingLot: null,
        vehicles: [],
        name: 'Company',
        cnpj: '11111111111',
        password: 'ZZZZ.YYYY',
        address: 'Street test',
        phone: '11111111111',
      };

      const { password, ...companyWithoutPassword } = company;

      const findOneByCnpjSpy = jest
        .spyOn(companyService, 'findOneByCnpj')
        .mockResolvedValueOnce(company);

      const comparePasswordSpy = jest
        .spyOn(service, 'comparePassword')
        .mockResolvedValueOnce(true);

      const generateTokenSpy = jest
        .spyOn(service, 'generateToken')
        .mockResolvedValueOnce('access_token');

      const result = await service.signin(signInDto);

      expect(findOneByCnpjSpy).toHaveBeenCalledWith(signInDto.cnpj);
      expect(comparePasswordSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          password: signInDto.password,
          salt: company.password.split('.')[0],
          storedHash: company.password.split('.')[1],
        }),
      );
      expect(generateTokenSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result.company).toEqual(
        expect.objectContaining({
          ...companyWithoutPassword,
        }),
      );
      expect(result.accessToken).toBe('access_token');
    });

    it('should throw InvalidCredentialsException when the provided credentials are invalid', async () => {
      const signInDto: SignInDto = {
        cnpj: '11111111111',
        password: 'XXXXXX',
      };

      const company: Company = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingLot: null,
        vehicles: [],
        name: 'Company',
        cnpj: '11111111111',
        password: 'ZZZZ.YYYY',
        address: 'Street test',
        phone: '11111111111',
      };

      jest.spyOn(companyService, 'findOneByCnpj').mockResolvedValue(company);

      jest.spyOn(service, 'comparePassword').mockResolvedValueOnce(false);

      await expect(service.signin(signInDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });
  });
});
