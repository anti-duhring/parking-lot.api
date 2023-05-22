import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { VehicleTypesEnum } from '../../models/vehicle/dto/vehicle-type.dto';

// Reference: https://github.com/typestack/class-validator#custom-validation-decorators
export function IsValidCarType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBrazilianVehiclePlate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          return Object.values(VehicleTypesEnum).includes(
            value as VehicleTypesEnum,
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a of type "${VehicleTypesEnum.car}" or "${VehicleTypesEnum.motocycle}".`;
        },
      },
    });
  };
}
