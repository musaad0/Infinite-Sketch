import { Timer } from "@/models";

export const CLASS_MODE_OPTIONS = [
  "30m",
  "60m",
  "90m",
  "120m",
  "180m",
  "360m",
] as const;

export type ClassMode = (typeof CLASS_MODE_OPTIONS)[number];

export interface SessionInterval {
  timer: Timer;
  imagesToPlay: number;
  break?: {
    breakBetweenEachImageTime?: Timer;
    // when the current session in the interval ends -> this is for class mode
    breakAfterSectionEndsTime?: Timer;
  };
}

export const CLASS_MODES: Record<ClassMode, SessionInterval[]> = {
  "30m": [
    {
      //   timer: "30s",
      //   imagesToPlay: 10,
      timer: "5s",
      imagesToPlay: 3,
      break: {
        breakBetweenEachImageTime: "3s",
        breakAfterSectionEndsTime: "5s",
      },
    },
    {
      timer: "10s",
      imagesToPlay: 1,
    },
    {
      timer: "5m",
      imagesToPlay: 2,
    },
    {
      timer: "10m",
      imagesToPlay: 1,
    },
  ],
  "60m": [
    {
      timer: "30s",
      imagesToPlay: 10,
    },
  ],
  "90m": [],
  "120m": [],
  "180m": [],
  "360m": [],
};
