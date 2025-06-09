import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AlbumService } from '../services/album.service';
import { CreateAlbumDto } from '../models/dto/album.dto';
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
  createAlbum(@Body() albumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(
      albumDto.name,
      albumDto.year,
      albumDto.artistId || null,
    );
  }

  @Put(':id')
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() albumDto: CreateAlbumDto,
  ) {
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
