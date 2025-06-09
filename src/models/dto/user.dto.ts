import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

export class UpdateUserDto extends CreateUserDto {}

export type UserResponse = {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
};
