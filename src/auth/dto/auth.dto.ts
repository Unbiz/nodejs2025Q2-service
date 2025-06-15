import { IsString, MinLength, IsOptional } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(1)
  login: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class LoginDto {
  @IsString()
  @MinLength(1)
  login: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class RefreshDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  refreshToken?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  login: string;
  iat?: number;
  exp?: number;
}
