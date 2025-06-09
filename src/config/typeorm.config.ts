import { DataSource } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Album } from '../models/entities/album.entity';
import { Artist } from '../models/entities/artist.entity';
import { Track } from '../models/entities/track.entity';
import { User } from '../models/entities/user.entity';
import { Favorites } from '../models/entities/favorites.entity';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'music_service',
  entities: [Album, Artist, Track, User, Favorites],
  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  logging: ['error'],
};

export const dataSource = new DataSource(config as any);
export const typeOrmConfig = config;
export default dataSource;
