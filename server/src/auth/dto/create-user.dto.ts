import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsAlphanumeric,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string
  @IsEmail()
  email: string
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
  @IsOptional()
  @IsBoolean()
  test?: boolean
}
