import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Track } from './track.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsInt()
  year: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  artistId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist?: Artist;

  @OneToMany(() => Track, (track) => track.album)
  tracks?: Track[];
}
