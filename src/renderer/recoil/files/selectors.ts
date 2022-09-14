/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
import { selector } from 'recoil';
import { folders, shuffleState } from './atoms';

export const foldersTotal = selector({
  key: 'foldersTotal',
  get: ({ get }) => {
    const foldersList = get(folders);
    return foldersList.reduce((prev, { files }) => prev + files.length, 0);
  },
});

export const files = selector({
  key: 'files',
  get: ({ get }) => {
    const foldersList = get(folders);
    const shuffle = get(shuffleState);
    let filesList = foldersList.map((o) => o.files).flat();
    if (shuffle.isShuffle) {
      filesList = shuffleList(filesList, shuffle.seed);
    }
    return filesList;
  },
});

const random = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

function shuffleList(array: string[], seed: number): string[] {
  if (!seed) {
    return array;
  }
  let m = array.length;
  let t;
  let i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }

  return array;
}
