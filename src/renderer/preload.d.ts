import { Channels } from 'main/preload';
import { Folder } from './types';

declare global {
  interface Window {
    api: {
      send: (channel: Channels, data: any) => void;
      receive: (channel: Channels, func: any) => void;
      close: () => void;
      minimize: () => void;
      maximize: () => void;
      menu: () => void;
      getFolders(): Promise<void | Folder[]>;
      sendMessage(channel: Channels, args: unknown[]): void;
      on(
        channel: string,
        func: (...args: unknown[]) => void
      ): (() => void) | undefined;
      once(channel: string, func: (...args: unknown[]) => void): void;
      openDialog(): Promise<Folder[]>;
      store: {
        get(val: string): any;
        set(property: string, val: any): void;
      };
      // openDialog: async (): Promise<string | void | undefined>;
    };
  }
}

export {};
