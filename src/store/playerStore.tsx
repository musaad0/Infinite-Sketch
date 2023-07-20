import { ClassMode, SessionInterval } from "@/constants";
import { Shuffle, Timer } from "@/models";
import { playModesEnum } from "@/models/playModes";
import { z } from "zod";
import { create } from "zustand";

// TODO: move this to app store
// TODO: Split & Refactor

const actionsOnImageSchema = z.enum([
  "FLIP_HORIZONTAL",
  "FLIP_VERTICAL",
  "BLACK_AND_WHITE",
  "GRID",
  "DISABLE_ZOOM",
]);

export type ActionOnImage = z.infer<typeof actionsOnImageSchema>;

export type PlayMode = z.infer<typeof playModesEnum>;

interface PlayerStore {
  timer: Timer;
  index: number;
  isPlaying: boolean;
  playMode: PlayMode;
  imagesToDraw: number;
  intervalIndex: number;
  isBreak: boolean;
  breakTime: Timer;
  intervals: SessionInterval[];
  imagesSeen: number;
  actionsOnImage: z.infer<typeof actionsOnImageSchema>[];
  classModeLength: ClassMode;
  imageGridWidthHeight: number;
  shuffle: Shuffle;
  setTimer: (val: Timer) => void;
  setIsPlaying: (val: boolean) => void;
  setPlayMode: (val: PlayMode) => void;
  setShuffle: (val: Shuffle) => void;
  toggleActionOnImage: (val: ActionOnImage) => void;
  setClassModeLength: (val: ClassMode) => void;
  setImageGridWidthHeight: (val: number) => void;
  setIntervals: (val: SessionInterval[]) => void;
  nextIndex: () => void;
  setIndex: (index: number) => void;
  previousIndex: () => void;
  setImagesToDraw: (val: number) => void;
  setBreakTime: (val: Timer) => void;
  setIsBreak: (val: boolean) => void;
  addImagesSeen: (val: number) => void;
  setIntervalIndex: (val: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  timer: "30s",
  index: 0,
  isPlaying: false,
  intervalIndex: 0,
  isBreak: false,
  breakTime: "3s",
  imagesToDraw: 10,
  intervals: [
    {
      timer: "30s",
      imagesToPlay: 0,
    },
  ],
  classModeLength: "30m",
  playMode: "fixed",
  imageGridWidthHeight: 50,
  imagesSeen: 0,
  actionsOnImage: [],
  shuffle: {
    isShuffle: false,
    seed: 0,
  },
  setImageGridWidthHeight: (val) => set({ imageGridWidthHeight: val }),
  setIsBreak: (val) => set({ isBreak: val }),
  setIntervalIndex: (val) => set({ intervalIndex: val }),
  addImagesSeen: (val) =>
    set((state) => ({ imagesSeen: state.imagesSeen + val })),
  setBreakTime: (val) => set({ breakTime: val }),
  setImagesToDraw: (val) => set({ imagesToDraw: val }),
  setClassModeLength: (val) => set({ classModeLength: val }),
  setPlayMode: (val) => set({ playMode: val }),
  setIntervals: (val) => set({ intervals: val }),
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
