import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from '../models/entities/artist.entity';
import { StorageService } from './storage.service';

@Injectable()
export class ArtistService {
  constructor(private storageService: StorageService) {}

  getAllArtists(): Artist[] {
    return Array.from(this.storageService.getArtists().values());
  }

  getArtistById(id: string): Artist | undefined {
    return this.storageService.getArtists().get(id);
  }

  createArtist(name: string, grammy: boolean): Artist {
    const id = randomUUID();
    const artist: Artist = { id, name, grammy };
    this.storageService.getArtists().set(id, artist);

    return artist;
  }

  updateArtist(id: string, name: string, grammy: boolean): Artist | null {
    if (!this.storageService.getArtists().has(id)) {
      return null;
    }

    const artist: Artist = { id, name, grammy };
    this.storageService.getArtists().set(id, artist);

    return artist;
  }

  deleteArtist(id: string): boolean {
    const artists = this.storageService.getArtists();
    const albums = this.storageService.getAlbums();
    const tracks = this.storageService.getTracks();
    const favorites = this.storageService.getFavorites();

    if (artists.delete(id)) {
      favorites.artists = favorites.artists.filter(
        (artistId) => artistId !== id,
      );

      for (const [albumId, album] of albums.entries()) {
        if (album.artistId === id) {
          albums.set(albumId, { ...album, artistId: null });
        }
      }

      for (const [trackId, track] of tracks.entries()) {
        if (track.artistId === id) {
          tracks.set(trackId, { ...track, artistId: null });
        }
      }

      return true;
    }

    return false;
  }
}
