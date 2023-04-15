import { PartialType } from '@nestjs/swagger';
import { Type as validateType } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { CreateUserInputDto } from './create-user-input.dto';
import { BothPassword, FindUsersInputDto } from './find-users-input.dto';

export class UpdatePasswordInputDto extends PartialType(CreateUserInputDto) {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @validateType(() => FindUsersInputDto)
  public password_update!: BothPassword;
}
