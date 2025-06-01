import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from '../models/album.interface';
import { Artist } from '../models/artist.interface';
import { Track } from '../models/track.interface';
import { User, UserWithoutPassword } from '../models/user.interface';
import { Favorites } from '../models/favorites.interface';

@Injectable()
export class InMemoryDBService {
  private users: Map<string, User> = new Map();
  private artists: Map<string, Artist> = new Map();
  private albums: Map<string, Album> = new Map();
  private tracks: Map<string, Track> = new Map();
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getAllUsers(): UserWithoutPassword[] {
    return Array.from(this.users.values()).map((user) => {
      const userWithoutPassword = this.getUserWithoutPassword(user);

      return userWithoutPassword;
    });
  }

  getUserById(id: string): UserWithoutPassword | null {
    const user = this.users.get(id);

    if (user == null) {
      return null;
    }

    const userWithoutPassword = this.getUserWithoutPassword(user);

    return userWithoutPassword;
  }

  createUser(login: string, password: string): UserWithoutPassword {
    const id = randomUUID();
    const timestamp = Date.now();
    const user: User = {
      id,
      login,
      password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.users.set(id, user);
    const userWithoutPassword = this.getUserWithoutPassword(user);

    return userWithoutPassword;
  }

  updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): UserWithoutPassword | null | undefined {
    const user = this.users.get(id);

    if (user === undefined) {
      return undefined;
    }

    if (user.password !== oldPassword) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    this.users.set(id, updatedUser);
    const userWithoutPassword = this.getUserWithoutPassword(user);

    return userWithoutPassword;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  private getUserWithoutPassword(user: User): UserWithoutPassword {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  getAllArtists(): Artist[] {
    return Array.from(this.artists.values());
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.get(id);
  }

  createArtist(name: string, grammy: boolean): Artist {
    const id = randomUUID();
    const artist: Artist = { id, name, grammy };
    this.artists.set(id, artist);

    return artist;
  }

  updateArtist(id: string, name: string, grammy: boolean): Artist | null {
    if (!this.artists.has(id)) {
      return null;
    }

    const artist: Artist = { id, name, grammy };
    this.artists.set(id, artist);

    return artist;
  }

  deleteArtist(id: string): boolean {
    if (this.artists.delete(id)) {
      this.favorites.artists = this.favorites.artists.filter(
        (artistId) => artistId !== id,
      );

      for (const [albumId, album] of this.albums.entries()) {
        if (album.artistId === id) {
          this.albums.set(albumId, { ...album, artistId: null });
        }
      }

      for (const [trackId, track] of this.tracks.entries()) {
        if (track.artistId === id) {
          this.tracks.set(trackId, { ...track, artistId: null });
        }
      }

      return true;
    }

    return false;
  }

  getAllAlbums(): Album[] {
    return Array.from(this.albums.values());
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.get(id);
  }

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const id = randomUUID();
    const album: Album = { id, name, year, artistId };
    this.albums.set(id, album);

    return album;
  }

  updateAlbum(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Album | null {
    if (!this.albums.has(id)) {
      return null;
    }

    const album: Album = { id, name, year, artistId };
    this.albums.set(id, album);

    return album;
  }

  deleteAlbum(id: string): boolean {
    if (this.albums.delete(id)) {
      this.favorites.albums = this.favorites.albums.filter(
        (albumId) => albumId !== id,
      );

      for (const [trackId, track] of this.tracks.entries()) {
        if (track.albumId === id) {
          this.tracks.set(trackId, { ...track, albumId: null });
        }
      }

      return true;
    }

    return false;
  }

  getAllTracks(): Track[] {
    return Array.from(this.tracks.values());
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track {
    const id = randomUUID();
    const track: Track = { id, name, artistId, albumId, duration };
    this.tracks.set(id, track);

    return track;
  }

  updateTrack(
    id: string,
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track | null {
    if (!this.tracks.has(id)) {
      return null;
    }

    const track: Track = { id, name, artistId, albumId, duration };
    this.tracks.set(id, track);

    return track;
  }

  deleteTrack(id: string): boolean {
    if (this.tracks.delete(id)) {
      this.favorites.tracks = this.favorites.tracks.filter(
        (trackId) => trackId !== id,
      );

      return true;
    }

    return false;
  }

  getFavorites() {
    return {
      artists: this.favorites.artists
        .map((id) => this.artists.get(id))
        .filter(Boolean),
      albums: this.favorites.albums
        .map((id) => this.albums.get(id))
        .filter(Boolean),
      tracks: this.favorites.tracks
        .map((id) => this.tracks.get(id))
        .filter(Boolean),
    };
  }

  addTrackToFavorites(id: string): boolean {
    if (!this.tracks.has(id)) {
      return false;
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }

    return true;
  }

  addAlbumToFavorites(id: string): boolean {
    if (!this.albums.has(id)) {
      return false;
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }

    return true;
  }

  addArtistToFavorites(id: string): boolean {
    if (!this.artists.has(id)) {
      return false;
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }

    return true;
  }

  removeTrackFromFavorites(id: string): boolean {
    const index = this.favorites.tracks.indexOf(id);

    if (index === -1) {
      return false;
    }

    this.favorites.tracks.splice(index, 1);

    return true;
  }

  removeAlbumFromFavorites(id: string): boolean {
    const index = this.favorites.albums.indexOf(id);

    if (index === -1) {
      return false;
    }

    this.favorites.albums.splice(index, 1);

    return true;
  }

  removeArtistFromFavorites(id: string): boolean {
    const index = this.favorites.artists.indexOf(id);

    if (index === -1) {
      return false;
    }

    this.favorites.artists.splice(index, 1);

    return true;
  }
}
