import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  HttpCode,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { InMemoryDBService } from '../services/in-memory-db.service';
import { StatusCodes } from 'http-status-codes';

@Controller('favs')
export class FavoritesController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getFavorites() {
    return this.inMemoryDBService.getFavorites();
  }

  @Post('track/:id')
  addTrackToFavorites(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid trackId format');
    }

    const result = this.inMemoryDBService.addTrackToFavorites(id);

    if (!result) {
      throw new UnprocessableEntityException('Track does not exist');
    }
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteTrackFromFavorites(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid trackId format');
    }

    if (!this.inMemoryDBService.removeTrackFromFavorites(id)) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  @Post('album/:id')
  addAlbumToFavorites(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid albumId format');
    }

    const result = this.inMemoryDBService.addAlbumToFavorites(id);

    if (!result) {
      throw new UnprocessableEntityException('Album does not exist');
    }
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid albumId format');
    }

    if (!this.inMemoryDBService.removeAlbumFromFavorites(id)) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  @Post('artist/:id')
  addArtistToFavorites(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artistId format');
    }

    const result = this.inMemoryDBService.addArtistToFavorites(id);

    if (!result) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteArtistFromFavorites(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artistId format');
    }

    if (!this.inMemoryDBService.removeArtistFromFavorites(id)) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }
}
