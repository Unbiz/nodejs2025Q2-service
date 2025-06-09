import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from '../models/entities/favorites.entity';
import { Track } from '../models/entities/track.entity';
import { Album } from '../models/entities/album.entity';
import { Artist } from '../models/entities/artist.entity';
import { FavoritesResponse } from '../models/dto/favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.getFavoritesOrCreate();

    const artists = await Promise.all(
      favorites.artists.map(async (id) => {
        const artist = await this.artistRepository.findOne({ where: { id } });

        return artist || null;
      }),
    );

    const albums = await Promise.all(
      favorites.albums.map(async (id) => {
        const album = await this.albumRepository.findOne({ where: { id } });

        return album || null;
      }),
    );

    const tracks = await Promise.all(
      favorites.tracks.map(async (id) => {
        const track = await this.trackRepository.findOne({ where: { id } });

        return track || null;
      }),
    );

    return {
      artists: artists.filter((a): a is Artist => a !== null),
      albums: albums.filter((a): a is Album => a !== null),
      tracks: tracks.filter((t): t is Track => t !== null),
    };
  }

  async addTrackToFavorites(id: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const favorites = await this.getFavoritesOrCreate();

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async addAlbumToFavorites(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    const favorites = await this.getFavoritesOrCreate();

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async addArtistToFavorites(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    const favorites = await this.getFavoritesOrCreate();

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrackFromFavorites(id: string): Promise<void> {
    const favorites = await this.getFavoritesOrCreate();
    const index = favorites.tracks.indexOf(id);

    if (index === -1) {
      throw new NotFoundException(`Track with id ${id} not found in favorites`);
    }

    favorites.tracks.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeAlbumFromFavorites(id: string): Promise<void> {
    const favorites = await this.getFavoritesOrCreate();

    const index = favorites.albums.indexOf(id);

    if (index === -1) {
      throw new NotFoundException(`Album with id ${id} not found in favorites`);
    }

    favorites.albums.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  async removeArtistFromFavorites(id: string): Promise<void> {
    const favorites = await this.getFavoritesOrCreate();

    const index = favorites.artists.indexOf(id);

    if (index === -1) {
      throw new NotFoundException(
        `Artist with id ${id} not found in favorites`,
      );
    }

    favorites.artists.splice(index, 1);
    await this.favoritesRepository.save(favorites);
  }

  private async getFavoritesOrCreate(): Promise<Favorites> {
    const favorites = await this.favoritesRepository.findOne({ where: {} });

    if (favorites) {
      return favorites;
    }

    const newFavorites = this.favoritesRepository.create({
      artists: [],
      albums: [],
      tracks: [],
    });

    return this.favoritesRepository.save(newFavorites);
  }
}
