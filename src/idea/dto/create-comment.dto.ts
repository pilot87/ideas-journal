import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  ideaname: string
  @IsString()
  @IsNotEmpty()
  text: string
}
