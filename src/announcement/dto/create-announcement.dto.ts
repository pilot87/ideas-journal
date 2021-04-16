import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  ideaname: string
  @IsString()
  @IsNotEmpty()
  anname: string
  @IsString()
  @IsNotEmpty()
  text: string
  @IsArray()
  @IsString({ each: true })
  tags: string[]
}
