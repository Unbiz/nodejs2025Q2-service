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
  addTrackToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = this.inMemoryDBService.addTrackToFavorites(id);

    if (!result) {
      throw new UnprocessableEntityException('Track does not exist');
    }
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteTrackFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    if (!this.inMemoryDBService.removeTrackFromFavorites(id)) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  @Post('album/:id')
  addAlbumToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = this.inMemoryDBService.addAlbumToFavorites(id);

    if (!result) {
      throw new UnprocessableEntityException('Album does not exist');
    }
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteAlbumFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    if (!this.inMemoryDBService.removeAlbumFromFavorites(id)) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  @Post('artist/:id')
  addArtistToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = this.inMemoryDBService.addArtistToFavorites(id);

    if (!result) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteArtistFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    if (!this.inMemoryDBService.removeArtistFromFavorites(id)) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }
}
