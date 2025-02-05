import { IsObject } from 'class-validator';

/**
 * DTO for updating user attributes.
 * This is currently unrestricted.
 */
export class AddUserAttributesDto {
  @IsObject()
  readonly attributes: Record<string, string>;
}
