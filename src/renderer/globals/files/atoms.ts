import { atom } from 'recoil';
import { Folder, Shuffle } from '../../types';

export const folders = atom<Folder[]>({
  key: 'folders',
  default: [],
});

export const shuffleState = atom<Shuffle>({
  key: 'shuffleState',
  default: { isShuffle: false, seed: 1 },
});

export const indexState = atom({
  key: 'indexState',
  default: 0,
});

export const initialIndexState = atom({
  key: 'initialIndexState',
  default: 0,
});
