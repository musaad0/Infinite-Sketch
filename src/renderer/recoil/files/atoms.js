import { atom } from 'recoil';

export const folders = atom({
  key: 'folders',
  default: [],
});

export const shuffleState = atom({
  key: 'shuffleState',
  default: { isShuffle: false, seed: 1 },
});
