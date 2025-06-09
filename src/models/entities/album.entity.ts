import { IsString, IsInt, IsUUID, IsOptional, Min, Max } from 'class-validator';

export class Album {
  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;
}
