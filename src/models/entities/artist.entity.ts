import { IsString, IsBoolean, IsUUID } from 'class-validator';

export class Artist {
  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
