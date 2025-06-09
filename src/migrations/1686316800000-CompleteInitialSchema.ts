import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteInitialSchema1686316800000 implements MigrationInterface {
  name = 'CompleteInitialSchema1686316800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "artist" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "album" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "FK_album_artist" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "track" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "duration" integer NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        CONSTRAINT "FK_track_artist" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_track_album" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "artists" text NOT NULL DEFAULT '',
        "albums" text NOT NULL DEFAULT '',
        "tracks" text NOT NULL DEFAULT ''
      )
    `);

    await queryRunner.query(`
      INSERT INTO "favorites" (id, artists, albums, tracks) 
      VALUES (uuid_generate_v4(), '', '', '')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
