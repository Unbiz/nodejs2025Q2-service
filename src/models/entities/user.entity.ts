import { IsString, IsInt, IsUUID, IsPositive } from 'class-validator';
import { Exclude } from 'class-transformer';

export class User {
  @IsUUID('4')
  id: string;

  @IsString()
  login: string;

  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsInt()
  @IsPositive()
  version: number;

  @IsInt()
  @IsPositive()
  createdAt: number;

  @IsInt()
  @IsPositive()
  updatedAt: number;
}
