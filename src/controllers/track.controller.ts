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
import { TrackService } from '../services/track.service';
import { CreateTrackDto } from '../models/dto/track.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const track = this.trackService.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Post()
  createTrack(@Body() trackDto: CreateTrackDto) {
    return this.trackService.createTrack(
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
    const track = this.trackService.updateTrack(
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
    if (!this.trackService.deleteTrack(id)) {
      throw new NotFoundException('Track not found');
    }
  }
}
