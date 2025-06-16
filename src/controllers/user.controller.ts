import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from '../models/dto/user.dto';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(
      createUserDto.login,
      createUserDto.password,
    );
  }

  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      return await this.userService.updateUserPassword(
        id,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword,
      );
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new NotFoundException('User not found');
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.userService.deleteUser(id);

    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
