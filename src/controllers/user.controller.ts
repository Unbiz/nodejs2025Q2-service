import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InMemoryDBService } from '../services/in-memory-db.service';
import { CreateUserDto, UpdatePasswordDto } from '../models/user.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('user')
export class UserController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getAllUsers() {
    return this.inMemoryDBService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = this.inMemoryDBService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    if (
      typeof createUserDto.login !== 'string' ||
      createUserDto.login === '' ||
      typeof createUserDto.password !== 'string' ||
      createUserDto.password === ''
    ) {
      throw new BadRequestException('Missing required fields');
    }

    return this.inMemoryDBService.createUser(
      createUserDto.login,
      createUserDto.password,
    );
  }

  @Put(':id')
  updatePassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
      throw new BadRequestException('Missing required fields');
    }

    const user = this.inMemoryDBService.updateUserPassword(
      id,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword,
    );

    if (user === undefined) {
      throw new NotFoundException('User not found');
    }

    if (user === null) {
      throw new ForbiddenException('Old password is wrong');
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    if (!this.inMemoryDBService.deleteUser(id)) {
      throw new NotFoundException('User not found');
    }
  }
}
