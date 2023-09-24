import { appWindow } from "@tauri-apps/api/window";

export async function setAlwaysOnTop(val: boolean) {
  await appWindow.setAlwaysOnTop(val);
}

export async function setTransparentToMouse(val: boolean) {
  await appWindow.setIgnoreCursorEvents(val);
}

export async function setDecorations(val: boolean) {
  appWindow.setDecorations(val);
}

export async function getOsTheme() {
  return (await appWindow.theme()) || "dark";
}
