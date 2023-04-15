import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

export class FindUsersInputDto {
  @ApiProperty({
    description: 'email',
    example: 'demo@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'name',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  public username!: string;

  @ApiProperty({
    description: 'first_name',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  public first_name!: string;

  @ApiProperty({
    description: 'last_name',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  public last_name!: string;
}

export class BothPassword {
  @IsDefined()
  @IsString()
  old_password: string;

  @IsDefined()
  @IsString()
  new_password: string;
}
