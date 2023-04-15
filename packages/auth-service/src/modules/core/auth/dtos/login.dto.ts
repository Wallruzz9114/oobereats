import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginDto {
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
    description: 'password',
    example: '23435r3453453',
    required: true,
  })
  @IsDefined()
  @IsString()
  public password!: string;
}
