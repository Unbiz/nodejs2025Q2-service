import { Artist } from '../entities/artist.entity';
import { Album } from '../entities/album.entity';
import { Track } from '../entities/track.entity';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
