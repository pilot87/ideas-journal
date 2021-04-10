import { IsEmail, IsString, IsNotEmpty, IsAlphanumeric } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string
  @IsEmail()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}
