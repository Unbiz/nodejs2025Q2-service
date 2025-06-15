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
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from '../services/album.service';
import { CreateAlbumDto } from '../models/dto/album.dto';
import { StatusCodes } from 'http-status-codes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  async getAlbumById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  async createAlbum(@Body() albumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(
      albumDto.name,
      albumDto.year,
      albumDto.artistId || null,
    );
  }

  @Put(':id')
  async updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() albumDto: CreateAlbumDto,
  ) {
    const album = await this.albumService.updateAlbum(
      id,
      albumDto.name,
      albumDto.year,
      albumDto.artistId || null,
    );

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.albumService.deleteAlbum(id);
    if (!result) {
      throw new NotFoundException('Album not found');
    }
  }
}
