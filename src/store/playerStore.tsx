import { IFolder, Shuffle } from "@/models";
import { z } from "zod";
import { create } from "zustand";

// TODO: move this to app store

export type Timer = `${number}${"m" | "s"}`;

const actionsOnImageSchema = z.enum([
  "FLIP_HORIZONTAL",
  "FLIP_VERTICAL",
  "BLACK_AND_WHITE",
  "GRID",
]);
export type ActionOnImage = z.infer<typeof actionsOnImageSchema>;

interface FileStore {
  timer: Timer;
  index: number;
  isPlaying: boolean;
  actionsOnImage: z.infer<typeof actionsOnImageSchema>[];
  imageGridWidthHeight: number;
  shuffle: Shuffle;
  setTimer: (val: Timer) => void;
  setIsPlaying: (val: boolean) => void;
  setShuffle: (val: Shuffle) => void;
  toggleActionOnImage: (val: ActionOnImage) => void;
  setImageGridWidthHeight: (val: number) => void;
  nextIndex: () => void;
  setIndex: (index: number) => void;
  previousIndex: () => void;
}

export const usePlayerStore = create<FileStore>((set) => ({
  timer: "30s",
  index: 0,
  isPlaying: false,
  imageGridWidthHeight: 50,
  actionsOnImage: [],
  shuffle: {
    isShuffle: false,
    seed: 0,
  },
  setImageGridWidthHeight: (val) => set({ imageGridWidthHeight: val }),
  toggleActionOnImage: (val) =>
    set((state) => {
      if (state.actionsOnImage.includes(val))
        return {
          actionsOnImage: state.actionsOnImage.filter((item) => item !== val),
        };
      else {
        return {
          actionsOnImage: [...state.actionsOnImage, val],
        };
      }
    }),
  setShuffle: (val) =>
    set((state) => {
      return {
        shuffle: {
          ...state.shuffle,
          ...val,
        },
      };
    }),
  setTimer: (val: Timer) =>
    set(() => {
      return {
        timer: val,
      };
    }),
  nextIndex: () =>
    set((state) => {
      return {
        index: state.index + 1,
      };
    }),
  setIndex: (index) =>
    set(() => {
      return {
        index: index,
      };
    }),
  previousIndex: () =>
    set((state) => {
      return {
        index: state.index - 1,
      };
    }),
  setIsPlaying: (val) =>
    set(() => {
      return {
        isPlaying: val,
      };
    }),
}));
