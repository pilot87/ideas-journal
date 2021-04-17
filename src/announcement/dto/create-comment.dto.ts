import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  anname: string
  @IsString()
  @IsNotEmpty()
  text: string
}