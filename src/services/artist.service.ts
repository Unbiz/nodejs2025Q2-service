import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../models/entities/artist.entity';
import { Track } from '../models/entities/track.entity';
import { Favorites } from '../models/entities/favorites.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getAllArtists(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async getArtistById(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  async createArtist(name: string, grammy: boolean): Promise<Artist> {
    const artist = this.artistRepository.create({ name, grammy });

    return this.artistRepository.save(artist);
  }

  async updateArtist(
    id: string,
    name: string,
    grammy: boolean,
  ): Promise<Artist | null> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      return null;
    }

    Object.assign(artist, { name, grammy });

    return this.artistRepository.save(artist);
  }

  async deleteArtist(id: string): Promise<boolean> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      return false;
    }

    await this.trackRepository.update({ artistId: id }, { artistId: null });
    const favorites = await this.favoritesRepository.find();

    for (const favorite of favorites) {
      favorite.artists = favorite.artists.filter((artistId) => artistId !== id);
      await this.favoritesRepository.save(favorite);
    }

    await this.artistRepository.remove(artist);

    return true;
  }
}
