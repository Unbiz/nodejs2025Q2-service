import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';

@Injectable()
export class FavoritesService {
  constructor(private storageService: StorageService) {}

  getFavorites() {
    const favorites = this.storageService.getFavorites();
    const artists = this.storageService.getArtists();
    const albums = this.storageService.getAlbums();
    const tracks = this.storageService.getTracks();

    return {
      artists: favorites.artists.map((id) => artists.get(id)).filter(Boolean),
      albums: favorites.albums.map((id) => albums.get(id)).filter(Boolean),
      tracks: favorites.tracks.map((id) => tracks.get(id)).filter(Boolean),
    };
  }

  addTrackToFavorites(id: string): boolean {
    const tracks = this.storageService.getTracks();
    const favorites = this.storageService.getFavorites();

    if (!tracks.has(id)) {
      return false;
    }

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
    }

    return true;
  }

  addAlbumToFavorites(id: string): boolean {
    const albums = this.storageService.getAlbums();
    const favorites = this.storageService.getFavorites();

    if (!albums.has(id)) {
      return false;
    }

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
    }

    return true;
  }

  addArtistToFavorites(id: string): boolean {
    const artists = this.storageService.getArtists();
    const favorites = this.storageService.getFavorites();

    if (!artists.has(id)) {
      return false;
    }

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
    }

    return true;
  }

  removeTrackFromFavorites(id: string): boolean {
    const favorites = this.storageService.getFavorites();
    const index = favorites.tracks.indexOf(id);

    if (index === -1) {
      return false;
    }

    favorites.tracks.splice(index, 1);
    return true;
  }

  removeAlbumFromFavorites(id: string): boolean {
    const favorites = this.storageService.getFavorites();
    const index = favorites.albums.indexOf(id);

    if (index === -1) {
      return false;
    }

    favorites.albums.splice(index, 1);
    return true;
  }

  removeArtistFromFavorites(id: string): boolean {
    const favorites = this.storageService.getFavorites();
    const index = favorites.artists.indexOf(id);

    if (index === -1) {
      return false;
    }

    favorites.artists.splice(index, 1);
    return true;
  }
}
