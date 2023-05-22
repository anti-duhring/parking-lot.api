type CompanyId = string;
type UpdateCompanyDto = Partial<Omit<CreateCompanyDto, 'parkingSpots'>>;
