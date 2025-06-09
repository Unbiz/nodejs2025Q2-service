import { IsString, IsUUID, IsInt, IsNumber } from 'class-validator';

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

export class UserResponse {
  @IsUUID('4')
  id: string;

  @IsString()
  login: string;

  @IsInt()
  version: number;

  @IsNumber()
  createdAt: number;

  @IsNumber()
  updatedAt: number;
}
