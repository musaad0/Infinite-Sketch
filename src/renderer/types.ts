export interface Folder {
  name: string;
  path: string;
  files: string[];
  id: string;
}
export interface Shuffle {
  isShuffle: boolean;
  seed: number;
}
