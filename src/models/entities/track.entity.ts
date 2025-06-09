import { IsString, IsInt, IsUUID, IsOptional, Min } from 'class-validator';

export class Track {
  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsUUID('4')
  artistId: string | null;

  @IsOptional()
  @IsUUID('4')
  albumId: string | null;

  @IsInt()
  @Min(0)
  duration: number;
}
