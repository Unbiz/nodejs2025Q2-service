import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../models/entities/user.entity';
import { UserResponse } from '../models/dto/user.dto';
import { StorageService } from './storage.service';

@Injectable()
export class UserService {
  constructor(private storageService: StorageService) {}

  getAllUsers(): UserResponse[] {
    return Array.from(this.storageService.getUsers().values()).map((user) => {
      const userWithoutPassword = this.getUserWithoutPassword(user);
      return userWithoutPassword;
    });
  }

  getUserById(id: string): UserResponse | null {
    const user = this.storageService.getUsers().get(id);

    if (user == null) {
      return null;
    }

    const userWithoutPassword = this.getUserWithoutPassword(user);
    return userWithoutPassword;
  }

  createUser(login: string, password: string): UserResponse {
    const id = randomUUID();
    const timestamp = Date.now();
    const user: User = {
      id,
      login,
      password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.storageService.getUsers().set(id, user);
    const userWithoutPassword = this.getUserWithoutPassword(user);

    return userWithoutPassword;
  }

  updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): UserResponse | null | undefined {
    const user = this.storageService.getUsers().get(id);

    if (user === undefined) {
      return undefined;
    }

    if (user.password !== oldPassword) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    this.storageService.getUsers().set(id, updatedUser);
    const userWithoutPassword = this.getUserWithoutPassword(updatedUser);

    return userWithoutPassword;
  }

  deleteUser(id: string): boolean {
    return this.storageService.getUsers().delete(id);
  }

  private getUserWithoutPassword(user: User): UserResponse {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
