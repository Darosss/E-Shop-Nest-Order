import { ValidationOptions, ValidateBy, buildMessage } from 'class-validator';

export function IsPositiveValues(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isPositiveValues',
      validator: {
        validate(value: { [key: number]: number }): boolean {
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              if (value[key] <= 0) {
                return false;
              }
            }
          }
          return true;
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property values must be greater than zero',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
