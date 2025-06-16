import { IsString, IsInt, IsUUID, IsOptional, Min } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID('4')
  artistId?: string;

  @IsOptional()
  @IsUUID('4')
  albumId?: string;

  @IsInt()
  @Min(0)
  duration: number;
}

export class UpdateTrackDto extends CreateTrackDto {}
