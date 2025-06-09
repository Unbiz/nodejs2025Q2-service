import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  NotFoundException,
  UnprocessableEntityException,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { StatusCodes } from 'http-status-codes';
import { FavoritesResponse } from '../models/dto/favorites.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getFavorites(): Promise<FavoritesResponse> {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  async addTrackToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      await this.favoritesService.addTrackToFavorites(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Track does not exist');
      }

      throw error;
    }
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteTrackFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      await this.favoritesService.removeTrackFromFavorites(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Post('album/:id')
  async addAlbumToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      await this.favoritesService.addAlbumToFavorites(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Album does not exist');
      }

      throw error;
    }
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteAlbumFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      await this.favoritesService.removeAlbumFromFavorites(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw error;
    }
  }

  @Post('artist/:id')
  async addArtistToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      await this.favoritesService.addArtistToFavorites(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException('Artist does not exist');
      }

      throw error;
    }
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteArtistFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      await this.favoritesService.removeArtistFromFavorites(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw error;
    }
  }
}
