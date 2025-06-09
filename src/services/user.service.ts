import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserWithoutPassword } from '../models/user.interface';
import { StorageService } from './storage.service';

@Injectable()
export class UserService {
  constructor(private storageService: StorageService) {}

  getAllUsers(): UserWithoutPassword[] {
    return Array.from(this.storageService.getUsers().values()).map((user) => {
      const userWithoutPassword = this.getUserWithoutPassword(user);
      return userWithoutPassword;
    });
  }

  getUserById(id: string): UserWithoutPassword | null {
    const user = this.storageService.getUsers().get(id);

    if (user == null) {
      return null;
    }

    const userWithoutPassword = this.getUserWithoutPassword(user);
    return userWithoutPassword;
  }

  createUser(login: string, password: string): UserWithoutPassword {
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
  ): UserWithoutPassword | null | undefined {
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

  private getUserWithoutPassword(user: User): UserWithoutPassword {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
