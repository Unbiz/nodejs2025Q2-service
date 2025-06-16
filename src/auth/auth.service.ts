import {
  Injectable,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../models/entities/user.entity';
import { AuthResponse, JwtPayload, SignupDto, LoginDto } from './dto/auth.dto';
import { UserResponse } from '../models/dto/user.dto';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private loggingService: LoggingService,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserResponse> {
    const { login, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { login },
    });

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    const saltRounds = parseInt(process.env.CRYPT_SALT || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      login,
      password: hashedPassword,
      version: 1,
    });

    const savedUser = await this.userRepository.save(user);
    await this.loggingService.log(`User created: ${login}`, 'AuthService');

    return this.getUserWithoutPassword(savedUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { login, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });

    await this.loggingService.log(`User logged in: ${login}`, 'AuthService');

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string | undefined): Promise<AuthResponse> {
    if (
      !refreshToken ||
      typeof refreshToken !== 'string' ||
      refreshToken.trim() === ''
    ) {
      throw new UnauthorizedException('Refresh token must be provided');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      }) as JwtPayload;

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const newPayload: JwtPayload = { userId: user.id, login: user.login };
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      });

      await this.loggingService.log(
        `Tokens refreshed for user: ${user.login}`,
        'AuthService',
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new ForbiddenException('Invalid or expired refresh token');
      }

      throw error;
    }
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    return user || null;
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
