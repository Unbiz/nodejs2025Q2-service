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
import { CreateArtistDto } from '../models/dto/artist.dto';
import { StatusCodes } from 'http-status-codes';
import { ArtistService } from '../services/artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  async getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.artistService.getArtistById(id);
  }

  @Post()
  async createArtist(@Body() artistDto: CreateArtistDto) {
    return this.artistService.createArtist(artistDto.name, artistDto.grammy);
  }

  @Put(':id')
  async updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() artistDto: CreateArtistDto,
  ) {
    const artist = await this.artistService.updateArtist(
      id,
      artistDto.name,
      artistDto.grammy,
    );

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.artistService.deleteArtist(id);

    if (!result) {
      throw new NotFoundException('Artist not found');
    }
  }
}
