type CompanyId = string;
type UpdateCompanyDto = Partial<Omit<CreateCompanyDto, 'parkingSpots'>>;
type CompanyUser = {
  username: string;
  sub: CompanyId;
};
