import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateAnnouncementDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
  @IsString()
  @IsNotEmpty()
  anname: string
  @IsString()
  @IsNotEmpty()
  short_desc: string
  @IsString()
  @IsNotEmpty()
  text: string
  @IsString()
  link: string
  @IsArray()
  @IsString({ each: true })
  tags: string[]
}
