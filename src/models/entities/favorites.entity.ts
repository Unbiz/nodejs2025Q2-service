import { IsArray, IsUUID } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  @IsArray()
  @IsUUID('4', { each: true })
  artists: string[];

  @Column('simple-array')
  @IsArray()
  @IsUUID('4', { each: true })
  albums: string[];

  @Column('simple-array')
  @IsArray()
  @IsUUID('4', { each: true })
  tracks: string[];
}
