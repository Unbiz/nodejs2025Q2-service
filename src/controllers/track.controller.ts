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
import { CreateTrackDto } from '../models/track.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('track')
export class TrackController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getAllTracks() {
    return this.inMemoryDBService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const track = this.inMemoryDBService.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Post()
  createTrack(@Body() trackDto: CreateTrackDto) {
    if (!trackDto.name || trackDto.duration === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    return this.inMemoryDBService.createTrack(
      trackDto.name,
      trackDto.artistId || null,
      trackDto.albumId || null,
      trackDto.duration,
    );
  }

  @Put(':id')
  updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() trackDto: CreateTrackDto,
  ) {
    if (!trackDto.name || trackDto.duration === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    const track = this.inMemoryDBService.updateTrack(
      id,
      trackDto.name,
      trackDto.artistId || null,
      trackDto.albumId || null,
      trackDto.duration,
    );

    if (track == null) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    if (!this.inMemoryDBService.deleteTrack(id)) {
      throw new NotFoundException('Track not found');
    }
  }
}
