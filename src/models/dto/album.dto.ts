import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsUUID('4')
  artistId?: string;
}

export class UpdateAlbumDto extends CreateAlbumDto {}
