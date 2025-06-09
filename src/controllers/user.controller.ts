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
import { CreateUserDto, UpdatePasswordDto } from '../models/user.interface';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = this.userService.getUserById(id);

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

    return this.userService.createUser(
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

    const user = this.userService.updateUserPassword(
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
    if (!this.userService.deleteUser(id)) {
      throw new NotFoundException('User not found');
    }
  }
}
