import { Injectable } from '@nestjs/common';
import { Album } from '../models/album.interface';
import { Artist } from '../models/artist.interface';
import { Track } from '../models/track.interface';
import { User } from '../models/user.interface';
import { Favorites } from '../models/favorites.interface';

@Injectable()
export class StorageService {
  private users: Map<string, User> = new Map();
  private artists: Map<string, Artist> = new Map();
  private albums: Map<string, Album> = new Map();
  private tracks: Map<string, Track> = new Map();
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getUsers(): Map<string, User> {
    return this.users;
  }

  getArtists(): Map<string, Artist> {
    return this.artists;
  }

  getAlbums(): Map<string, Album> {
    return this.albums;
  }

  getTracks(): Map<string, Track> {
    return this.tracks;
  }

  getFavorites(): Favorites {
    return this.favorites;
  }
}
