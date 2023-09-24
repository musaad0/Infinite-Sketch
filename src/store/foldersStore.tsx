import { create } from "zustand";

import { IFile, IFolder } from "@/models";

// TODO: move this to app store

interface FileStore {
  folders: IFolder[];
  files: IFile[];
  addFolder: (folder: IFolder) => void;
  setFolders: (files: IFolder[]) => void;
  deleteFolder: (id: string) => void;
}

export const useFoldersStore = create<FileStore>()((set) => ({
  folders: [],
  files: [],
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) =>
    set((state) => {
      return {
        folders: [...state.folders, folder],
      };
    }),
  deleteFolder: (id) =>
    set((state) => {
      return {
        folders: state.folders.filter((item) => item.id !== id),
      };
    }),
}));
