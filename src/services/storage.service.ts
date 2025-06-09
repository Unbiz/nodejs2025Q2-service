import { Injectable } from '@nestjs/common';
import { Album } from '../models/entities/album.entity';
import { Artist } from '../models/entities/artist.entity';
import { Track } from '../models/entities/track.entity';
import { User } from '../models/entities/user.entity';
import { Favorites } from '../models/entities/favorites.entity';

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
