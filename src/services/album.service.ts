import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../models/entities/album.entity';
import { Track } from '../models/entities/track.entity';
import { Favorites } from '../models/entities/favorites.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getAllAlbums(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async getAlbumById(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  async createAlbum(
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album> {
    const album = this.albumRepository.create({ name, year, artistId });

    return this.albumRepository.save(album);
  }

  async updateAlbum(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album | null> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      return null;
    }

    Object.assign(album, { name, year, artistId });

    return this.albumRepository.save(album);
  }

  async deleteAlbum(id: string): Promise<boolean> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      return false;
    }

    await this.trackRepository.update({ albumId: id }, { albumId: null });
    const favorites = await this.favoritesRepository.find();

    for (const favorite of favorites) {
      favorite.albums = favorite.albums.filter((albumId) => albumId !== id);
      await this.favoritesRepository.save(favorite);
    }

    await this.albumRepository.remove(album);

    return true;
  }
}
