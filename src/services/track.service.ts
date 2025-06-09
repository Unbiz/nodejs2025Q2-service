import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from '../models/track.interface';
import { StorageService } from './storage.service';

@Injectable()
export class TrackService {
  constructor(private storageService: StorageService) {}

  getAllTracks(): Track[] {
    return Array.from(this.storageService.getTracks().values());
  }

  getTrackById(id: string): Track | undefined {
    return this.storageService.getTracks().get(id);
  }

  createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track {
    const id = randomUUID();
    const track: Track = { id, name, artistId, albumId, duration };
    this.storageService.getTracks().set(id, track);

    return track;
  }

  updateTrack(
    id: string,
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track | null {
    const tracks = this.storageService.getTracks();
    if (!tracks.has(id)) {
      return null;
    }

    const track: Track = { id, name, artistId, albumId, duration };
    tracks.set(id, track);

    return track;
  }

  deleteTrack(id: string): boolean {
    const tracks = this.storageService.getTracks();
    const favorites = this.storageService.getFavorites();

    if (tracks.delete(id)) {
      favorites.tracks = favorites.tracks.filter((trackId) => trackId !== id);

      return true;
    }

    return false;
  }
}
