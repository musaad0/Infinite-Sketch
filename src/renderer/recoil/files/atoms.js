import { atom } from 'recoil';

export const folders = atom({
  key: 'folders',
  default: [],
});

export const shuffleState = atom({
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
