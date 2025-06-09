import { IsString, IsInt, IsUUID, IsPositive, IsDate } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @Column()
  @IsString()
  login: string;

  @Column()
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: 1 })
  @IsInt()
  @IsPositive()
  version: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  @IsDate()
  updatedAt: Date;
}
