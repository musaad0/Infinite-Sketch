import {
  getOsTheme,
  setAlwaysOnTop,
  setDecorations,
  setTransparentToMouse,
} from "@/apis";
import { OperatingSystem, Theme } from "@/models";
import { getSettings, storeSettings } from "@/store/systemStore";
import { guessOperatingSystem } from "@/utils/useOperatingSystem";
import { create } from "zustand";
// TODO: put all other stores here

interface AppStore {
  alwaysOnTop: boolean;
  os: OperatingSystem;
  setAlwaysOnTop: (val: boolean) => Promise<void>;
  theme: Theme;
  transparentToMouse: boolean;
  windowBordersBars: boolean;
  // Opacity in the player page
  windowOpacity: number;
  setTransparentToMouse: (val: boolean) => Promise<void>;
  setTheme: (val: Theme) => void;
  setWindowOpacity: (val: number) => void;
  setWindowBordersBars: (val: boolean) => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  os: guessOperatingSystem(),
  theme: "light",
  alwaysOnTop: true,
  setAlwaysOnTop: async (val) => {
    set((state) => ({ alwaysOnTop: val }));
    setAlwaysOnTop(val);
    storeSettings({ alwaysOnTop: val });
  },
  setTheme: (val) => {
    set(() => ({ theme: val }));
    storeSettings({ theme: val });
  },
  windowOpacity: 100,
  windowBordersBars: true,
  transparentToMouse: false,
  setTransparentToMouse: async (val) => {
    set((state) => ({ transparentToMouse: val }));
    setTransparentToMouse(val);
  },
  setWindowOpacity: (val) => {
    set(() => ({ windowOpacity: val }));
  },
  setWindowBordersBars: async (val) => {
    set(() => ({ windowBordersBars: val }));
    setDecorations(val);
  },
}));

// get values from system then set them here
async function loadFromStorage() {
  const settings = await getSettings();
  if (typeof settings.alwaysOnTop === "boolean")
    useAppStore.getState().setAlwaysOnTop(settings.alwaysOnTop);
  // if we have not set theme before we get the default system theme and set it
  if (!settings.theme) {
    const sysTheme = await getOsTheme();
    storeSettings({ theme: sysTheme });
    useAppStore.getState().setTheme(sysTheme);
  } else {
    useAppStore.getState().setTheme(settings.theme);
  }
}

loadFromStorage();
