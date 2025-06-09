import { IsString, IsBoolean, IsUUID } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from './album.entity';
import { Track } from './track.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ default: false })
  @IsBoolean()
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums?: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks?: Track[];
}
