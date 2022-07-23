import { selector } from 'recoil';
import { folders } from './atoms';

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
    // return folderList.reduce((prev, { files }) => prev + files.length, 0)
    return foldersList.map((o) => o.files).flat();
  },
});
