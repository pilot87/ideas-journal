import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string
  @IsString()
  @IsNotEmpty()
  password: string
}
