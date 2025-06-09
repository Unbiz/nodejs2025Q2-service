import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InMemoryDBService } from '../services/in-memory-db.service';
import { ArtistDto } from '../models/artist.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('artist')
export class ArtistController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getAllArtists() {
    return this.inMemoryDBService.getAllArtists();
  }

  @Get(':id')
  getArtistById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const artist = this.inMemoryDBService.getArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  @Post()
  createArtist(@Body() artistDto: ArtistDto) {
    if (!artistDto.name || artistDto.grammy === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    return this.inMemoryDBService.createArtist(
      artistDto.name,
      artistDto.grammy,
    );
  }

  @Put(':id')
  updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() artistDto: ArtistDto,
  ) {
    if (
      typeof artistDto.name !== 'string' ||
      artistDto.name === '' ||
      typeof artistDto.grammy !== 'boolean'
    ) {
      throw new BadRequestException('Missing required fields');
    }

    const artist = this.inMemoryDBService.updateArtist(
      id,
      artistDto.name,
      artistDto.grammy,
    );

    if (artist == null) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    if (!this.inMemoryDBService.deleteArtist(id)) {
      throw new NotFoundException('Artist not found');
    }
  }
}
