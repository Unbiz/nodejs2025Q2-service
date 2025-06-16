import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../models/entities/user.entity';
import { UserResponse } from '../models/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();

    return users.map((user) => this.getUserWithoutPassword(user));
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.getUserWithoutPassword(user);
  }

  async createUser(login: string, password: string): Promise<UserResponse> {
    const saltRounds = parseInt(process.env.CRYPT_SALT || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      login,
      password: hashedPassword,
      version: 1,
    });

    const savedUser = await this.userRepository.save(user);

    return this.getUserWithoutPassword(savedUser);
  }

  async updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const saltRounds = parseInt(process.env.CRYPT_SALT || '10');
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedNewPassword;
    user.version += 1;
    const updatedUser = await this.userRepository.save(user);

    return this.getUserWithoutPassword(updatedUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return false;
    }

    await this.userRepository.remove(user);

    return true;
  }

  private getUserWithoutPassword(user: User): UserResponse {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.getTime()
          : user.createdAt,
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt.getTime()
          : user.updatedAt,
    };
  }
}
