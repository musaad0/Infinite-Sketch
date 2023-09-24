import { OperatingSystem } from "@/models";

export function guessOperatingSystem(): OperatingSystem {
  let os: OperatingSystem = "windows";
  if (navigator.userAgent.indexOf("Win") != -1) os = "windows";
  if (navigator.userAgent.indexOf("Mac") != -1) os = "macOS";
  if (
    navigator.userAgent.indexOf("X11") != -1 ||
    navigator.userAgent.indexOf("Linux") != -1
  )
    os = "linux";
  return os;
}
