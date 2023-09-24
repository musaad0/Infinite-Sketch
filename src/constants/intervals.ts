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
      imagesToPlay: 10,
      timer: "4s",
    },
    {
      imagesToPlay: 5,
      timer: "1m",
    },
    {
      imagesToPlay: 2,
      timer: "5m",
    },
    {
      imagesToPlay: 1,
      timer: "10m",
    },
  ],
  "60m": [
    {
      imagesToPlay: 10,
      timer: "30s",
    },
    {
      imagesToPlay: 5,
      timer: "1m",
    },
    {
      imagesToPlay: 2,
      timer: "5m",
    },
    {
      imagesToPlay: 1,
      timer: "1m",
      break: {
        breakAfterSectionEndsTime: "5m",
      },
    },
    {
      imagesToPlay: 1,
      timer: "25m",
    },
  ],
  "90m": [
    {
      imagesToPlay: 6,
      timer: "30s",
    },
    {
      imagesToPlay: 3,
      timer: "1m",
    },
    {
      imagesToPlay: 2,
      timer: "3m",
    },
    {
      imagesToPlay: 1,
      timer: "10m",
    },
    {
      imagesToPlay: 1,
      timer: "25m",
      break: {
        breakAfterSectionEndsTime: "8m",
      },
    },
    {
      imagesToPlay: 1,
      timer: "35m",
    },
  ],
  "120m": [
    {
      imagesToPlay: 6,
      timer: "30s",
    },
    {
      imagesToPlay: 3,
      timer: "1m",
    },
    {
      imagesToPlay: 2,
      timer: "5m",
    },
    {
      imagesToPlay: 2,
      timer: "10m",
    },
    {
      imagesToPlay: 1,
      timer: "20m",
      break: {
        breakAfterSectionEndsTime: "14m",
      },
    },
    {
      imagesToPlay: 1,
      timer: "50m",
    },
  ],
  "180m": [
    {
      imagesToPlay: 10,
      timer: "30s",
    },
    {
      imagesToPlay: 5,
      timer: "1m",
    },
    {
      imagesToPlay: 2,
      timer: "5m",
    },
    {
      imagesToPlay: 1,
      timer: "10m",
    },
    {
      imagesToPlay: 1,
      timer: "20m",
      break: {
        breakAfterSectionEndsTime: "10m",
      },
    },

    {
      imagesToPlay: 2,
      timer: "30m",
      break: {
        breakAfterSectionEndsTime: "10m",
      },
    },

    {
      imagesToPlay: 1,
      timer: "50m",
    },
  ],
  "360m": [
    {
      imagesToPlay: 10,
      timer: "30s",
    },
    {
      imagesToPlay: 5,
      timer: "1m",
    },
    {
      imagesToPlay: 2,
      timer: "5m",
    },
    {
      imagesToPlay: 1,
      timer: "10m",
    },
    {
      imagesToPlay: 1,
      timer: "20m",
      break: {
        breakAfterSectionEndsTime: "10m",
      },
    },
    {
      imagesToPlay: 2,
      timer: "30m",
      break: {
        breakAfterSectionEndsTime: "10m",
      },
    },

    {
      imagesToPlay: 1,
      timer: "50m",
      break: {
        breakAfterSectionEndsTime: "45m",
      },
    },
    {
      imagesToPlay: 6,
      timer: "30s",
    },
    {
      imagesToPlay: 4,
      timer: "1m",
    },
    {
      imagesToPlay: 3,
      timer: "5m",
    },
    {
      imagesToPlay: 1,
      timer: "10m",
    },
    {
      imagesToPlay: 1,
      timer: "45m",
      break: {
        breakAfterSectionEndsTime: "10m",
      },
    },
    {
      imagesToPlay: 1,
      timer: "110m",
    },
  ],
};
