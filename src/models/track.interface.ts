export interface Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface CreateTrackDto {
  name: string;
  artistId?: string;
  albumId?: string;
  duration: number;
}
