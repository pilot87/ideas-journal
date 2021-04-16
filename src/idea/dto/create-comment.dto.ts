import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  idea: string
  @IsString()
  @IsNotEmpty()
  text: string
}
