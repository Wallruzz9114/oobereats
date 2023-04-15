import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserInputDto {
  @ApiProperty({
    description: 'email',
    example: 'hello@gmail.com',
    required: true,
  })
  @IsDefined()
  @IsString()
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'username',
    example: 'jogn_doe',
    required: true,
  })
  @IsOptional()
  @IsString()
  public username!: string;

  @ApiProperty({
    description: 'password',
    example: '34535SDF353@#22342',
    required: true,
  })
  @IsDefined()
  @IsString()
  @MinLength(8)
  public password!: string;
}
