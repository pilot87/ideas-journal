import { IsNotEmpty, IsString } from 'class-validator'

export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  ideaname: string
  @IsString()
  @IsNotEmpty()
  anname: string
  @IsString()
  @IsNotEmpty()
  comment: string
}
