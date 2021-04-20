import { IsNotEmpty, IsString } from 'class-validator'

export class ChooseAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  ideaname: string
  @IsString()
  @IsNotEmpty()
  anname: string
}
