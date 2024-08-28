import { BaseResponse } from '../base-response/base-response.dto';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ErrorMessage } from '../../common/utils/message-const';

export const buildError = (message: string): BaseResponse => {
  return {
    data: null,
    isSuccess: false,
    message: message,
  };
};

// Check if the date is greater than or equal to the current date
export function IsAfterOrEqualToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterOrEqualToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const today = new Date().setHours(0, 0, 0, 0); // Today's date at midnight
          const dateValue = new Date(value).getTime();
          return dateValue >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} ${ErrorMessage.INVALID_DATE} (must be today or in the future)`;
        },
      },
    });
  };
}

// Check if the end date is greater than the start date
export function IsAfterStartDate(
  startDateProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const startDate = (args.object as any)[startDateProperty];
          return new Date(value).getTime() > new Date(startDate).getTime();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} ${ErrorMessage.INVALID_DATE} (must be later than ${startDateProperty})`;
        },
      },
    });
  };
}
