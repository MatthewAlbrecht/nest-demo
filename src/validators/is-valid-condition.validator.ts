import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidConditionConstraint
  implements ValidatorConstraintInterface
{
  validate(condition: any): boolean {
    if (typeof condition !== 'string' || condition.trim() === '') return true; // leave empty as valid
    const tokens = condition.split(/\s+/);
    if (tokens.length < 3) return false;

    // Verify first comparison: <identifier> = <identifier>
    if (
      !this.isIdentifier(tokens[0]) ||
      tokens[1] !== '=' ||
      !this.isIdentifier(tokens[2])
    ) {
      return false;
    }

    // After first condition, expect pairs: [operator, identifier, '=', identifier]
    let i = 3;
    while (i < tokens.length) {
      const op = tokens[i++];
      if (op !== '&' && op !== '|') return false;
      if (i + 2 >= tokens.length) return false;
      if (!this.isIdentifier(tokens[i++])) return false;
      if (tokens[i++] !== '=') return false;
      if (!this.isIdentifier(tokens[i++])) return false;
    }

    return true;
  }

  isIdentifier(token: string): boolean {
    // Allow alphanumerics and underscores
    return /^[A-Za-z0-9_]+$/.test(token);
  }

  defaultMessage() {
    return 'Condition must be a valid string (e.g., "role = super_admin & foo = bar | subscription = premium").';
  }
}

export function IsValidCondition(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCondition',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidConditionConstraint,
    });
  };
}
