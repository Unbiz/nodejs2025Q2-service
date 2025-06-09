import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../models/entities/track.entity';
import { Favorites } from '../models/entities/favorites.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getAllTracks(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async getTrackById(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  async createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Promise<Track> {
    const track = this.trackRepository.create({
      name,
      artistId,
      albumId,
      duration,
    });

    return this.trackRepository.save(track);
  }

  async updateTrack(
    id: string,
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Promise<Track | null> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      return null;
    }

    Object.assign(track, { name, artistId, albumId, duration });

    return this.trackRepository.save(track);
  }

  async deleteTrack(id: string): Promise<boolean> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      return false;
    }

    const favorites = await this.favoritesRepository.find();

    for (const favorite of favorites) {
      favorite.tracks = favorite.tracks.filter((trackId) => trackId !== id);
      await this.favoritesRepository.save(favorite);
    }

    await this.trackRepository.remove(track);

    return true;
  }
}
