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
import { TrackService } from '../services/track.service';
import { CreateTrackDto } from '../models/dto/track.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  async getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  async getTrackById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.trackService.getTrackById(id);
  }

  @Post()
  async createTrack(@Body() trackDto: CreateTrackDto) {
    return this.trackService.createTrack(
      trackDto.name,
      trackDto.artistId || null,
      trackDto.albumId || null,
      trackDto.duration,
    );
  }

  @Put(':id')
  async updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() trackDto: CreateTrackDto,
  ) {
    const track = await this.trackService.updateTrack(
      id,
      trackDto.name,
      trackDto.artistId || null,
      trackDto.albumId || null,
      trackDto.duration,
    );

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.trackService.deleteTrack(id);

    if (!result) {
      throw new NotFoundException('Track not found');
    }
  }
}
