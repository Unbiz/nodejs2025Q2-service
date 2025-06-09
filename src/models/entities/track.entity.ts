import { IsString, IsInt, IsUUID, IsOptional, Min } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  artistId: string | null;

  @Column({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  albumId: string | null;

  @Column()
  @IsInt()
  @Min(0)
  duration: number;

  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist?: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'albumId' })
  album?: Album;
}
