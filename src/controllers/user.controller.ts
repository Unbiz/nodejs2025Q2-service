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
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { InMemoryDBService } from '../services/in-memory-db.service';
import { CreateUserDto, UpdatePasswordDto } from '../models/user.interface';

@Controller('user')
export class UserController {
  constructor(private inMemoryDBService: InMemoryDBService) {}

  @Get()
  getAllUsers() {
    return this.inMemoryDBService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid userId format');
    }

    const user = this.inMemoryDBService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Missing required fields');
    }

    return this.inMemoryDBService.createUser(
      createUserDto.login,
      createUserDto.password,
    );
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid userId format');
    }

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
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid userId format');
    }

    if (!this.inMemoryDBService.deleteUser(id)) {
      throw new NotFoundException('User not found');
    }
  }
}
