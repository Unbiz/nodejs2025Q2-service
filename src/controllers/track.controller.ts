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
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { InMemoryDBService } from '../services/in-memory-db.service';
import { CreateTrackDto } from '../models/track.interface';

@Controller('track')
export class TrackController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getAllTracks() {
    return this.inMemoryDBService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid trackId format');
    }

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

    if (trackDto.artistId && !uuidValidate(trackDto.artistId)) {
      throw new BadRequestException('Invalid artistId format');
    }

    if (trackDto.albumId && !uuidValidate(trackDto.albumId)) {
      throw new BadRequestException('Invalid albumId format');
    }

    return this.inMemoryDBService.createTrack(
      trackDto.name,
      trackDto.artistId || null,
      trackDto.albumId || null,
      trackDto.duration,
    );
  }

  @Put(':id')
  updateTrack(@Param('id') id: string, @Body() trackDto: CreateTrackDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid trackId format');
    }

    if (!trackDto.name || trackDto.duration === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    if (trackDto.artistId && !uuidValidate(trackDto.artistId)) {
      throw new BadRequestException('Invalid artistId format');
    }

    if (trackDto.albumId && !uuidValidate(trackDto.albumId)) {
      throw new BadRequestException('Invalid albumId format');
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
  deleteTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid trackId format');
    }

    if (!this.inMemoryDBService.deleteTrack(id)) {
      throw new NotFoundException('Track not found');
    }
  }
}
