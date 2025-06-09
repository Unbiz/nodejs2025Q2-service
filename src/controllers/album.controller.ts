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
import { AlbumService } from '../services/album.service';
import { AlbumDto } from '../models/album.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const album = this.albumService.getAlbumById(id);

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

    return this.albumService.createAlbum(
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

    const album = this.albumService.updateAlbum(
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
    if (!this.albumService.deleteAlbum(id)) {
      throw new NotFoundException('Album not found');
    }
  }
}
