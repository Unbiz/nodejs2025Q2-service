import { IsArray, IsUUID } from 'class-validator';

export class Favorites {
  @IsArray()
  @IsUUID('4', { each: true })
  artists: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  albums: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  tracks: string[];
}
