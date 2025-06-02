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
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
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
  getArtistById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artistId format');
    }

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
  updateArtist(@Param('id') id: string, @Body() artistDto: ArtistDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artistId format');
    }

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
  deleteArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artistId format');
    }

    if (!this.inMemoryDBService.deleteArtist(id)) {
      throw new NotFoundException('Artist not found');
    }
  }
}
