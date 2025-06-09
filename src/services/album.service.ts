import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from '../models/album.interface';
import { StorageService } from './storage.service';

@Injectable()
export class AlbumService {
  constructor(private storageService: StorageService) {}

  getAllAlbums(): Album[] {
    return Array.from(this.storageService.getAlbums().values());
  }

  getAlbumById(id: string): Album | undefined {
    return this.storageService.getAlbums().get(id);
  }

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const id = randomUUID();
    const album: Album = { id, name, year, artistId };
    this.storageService.getAlbums().set(id, album);

    return album;
  }

  updateAlbum(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Album | null {
    const albums = this.storageService.getAlbums();
    if (!albums.has(id)) {
      return null;
    }

    const album: Album = { id, name, year, artistId };
    albums.set(id, album);

    return album;
  }

  deleteAlbum(id: string): boolean {
    const albums = this.storageService.getAlbums();
    const tracks = this.storageService.getTracks();
    const favorites = this.storageService.getFavorites();

    if (albums.delete(id)) {
      favorites.albums = favorites.albums.filter((albumId) => albumId !== id);

      for (const [trackId, track] of tracks.entries()) {
        if (track.albumId === id) {
          tracks.set(trackId, { ...track, albumId: null });
        }
      }

      return true;
    }

    return false;
  }
}
