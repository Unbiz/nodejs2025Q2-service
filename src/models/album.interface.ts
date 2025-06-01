export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export interface AlbumDto {
  name: string;
  year: number;
  artistId?: string;
}
