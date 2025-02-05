import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsValidCondition } from 'src/validators/is-valid-condition.validator';

/**
 * DTO for adding a new policy.
 */
export class AddPolicyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly resource: string;

  @IsNotEmpty()
  @IsString()
  readonly action: string;

  @IsNotEmpty()
  @IsString()
  readonly effect: 'allow' | 'deny';

  @IsOptional()
  @IsString()
  @IsValidCondition()
  readonly condition?: string;
}
