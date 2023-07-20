import { Timer } from "@/models";

export function convertSecondsToReadableTime(sec: number | string) {
  let seconds = parseInt("" + sec, 10);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  if (!!hours) {
    if (!!minutes) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${seconds}s`;
    }
  }
  if (!!minutes) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function HHMMSS(seconds: number) {
  if (seconds <= 60) return seconds;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

export function convertInputToSecondsNumber(intervalInput: Timer) {
  const lastInputChar = intervalInput[intervalInput.length - 1].toLowerCase();
  if (typeof lastInputChar === "string" && lastInputChar === "m") {
    // convert minutes to seconds
    return parseInt(intervalInput, 10) * 60;
  }
  // seconds is default
  return parseInt(intervalInput, 10);
}
