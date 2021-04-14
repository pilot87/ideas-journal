import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  ideaname: string
  @IsString()
  @IsNotEmpty()
  describtion: string
  @IsString()
  @IsNotEmpty()
  short_desc: string
  @IsString()
  link: string
  @IsArray()
  @IsString({ each: true })
  tags: string[]
}
