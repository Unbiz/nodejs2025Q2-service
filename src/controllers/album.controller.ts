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
import { validate as uuidValidate } from 'uuid';
import { InMemoryDBService } from '../services/in-memory-db.service';
import { AlbumDto } from '../models/album.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('album')
export class AlbumController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getAllAlbums() {
    return this.inMemoryDBService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const album = this.inMemoryDBService.getAlbumById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  @Post()
  createAlbum(@Body() albumDto: AlbumDto) {
    if (!albumDto.name || albumDto.year === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    return this.inMemoryDBService.createAlbum(
      albumDto.name,
      albumDto.year,
      albumDto.artistId || null,
    );
  }

  @Put(':id')
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() albumDto: AlbumDto,
  ) {
    if (!albumDto.name || albumDto.year === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    if (albumDto.artistId && !uuidValidate(albumDto.artistId)) {
      throw new BadRequestException('Invalid artistId format');
    }

    const album = this.inMemoryDBService.updateAlbum(
      id,
      albumDto.name,
      albumDto.year,
      albumDto.artistId || null,
    );

    if (album == null) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    if (!this.inMemoryDBService.deleteAlbum(id)) {
      throw new NotFoundException('Album not found');
    }
  }
}
