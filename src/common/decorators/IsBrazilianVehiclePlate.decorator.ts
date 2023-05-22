import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// Reference: https://ricardo.coelho.eti.br/regex-mercosul/
const PLATE_REGEX = /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/;

// Reference: https://github.com/typestack/class-validator#custom-validation-decorators
export function IsBrazilianVehiclePlate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBrazilianVehiclePlate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          value = value.replace(/-/g, '');
          if (typeof value !== 'string') {
            return false;
          }
          return PLATE_REGEX.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Brazilian vehicle plate.`;
        },
      },
    });
  };
}
