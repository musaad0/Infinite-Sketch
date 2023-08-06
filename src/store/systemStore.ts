import { ThemeScema, shuffleSchema } from "@/models";
import { playModesEnum } from "@/models/playModes";
import { Progress, ProgressSchema } from "@/store/common";
import { Store } from "tauri-plugin-store-api";
import { z } from "zod";

// TODO: move & update this schema to a common one and use actual types instead of z.string()
const sessionSchema = z.object({
  timer: z.string().optional(), // should be ex: 1s or 2m,
  playMode: playModesEnum.optional(),
  isBreak: z.boolean().optional(),
  imagesToDraw: z.number().optional(),
  classModeLength: z.string().optional(),
  breakTime: z.string().optional(), // should be ex: 1s or 2m,
  shuffle: shuffleSchema.optional(),
});

const settingsSchema = z
  .object({
    alwaysOnTop: z.boolean().optional(),
    theme: ThemeScema.optional(),
  })
  .optional()
  .nullable();

type SessionStore = z.infer<typeof sessionSchema>;

type SettingsStore = z.infer<typeof settingsSchema>;

const settingsStore = new Store(".settings.dat");
export const sessionStore = new Store("session");

export async function storeSessionData(data: Partial<SessionStore>) {
  const parsedData = sessionSchema.safeParse(data);

  if (!parsedData.success) return;

  await sessionStore.set("session", parsedData.data);

  await sessionStore.save(); // this manually saves the store, otherwise the store is only saved when your app is closed
}

export async function getSessionData() {
  return await sessionStore
    .get("session")
    .then((item) => sessionSchema.parse(item));
}

export async function storeSettings(data: Partial<SettingsStore>) {
  const parsedData = settingsSchema.safeParse(data);

  if (!parsedData.success) return;

  await settingsStore.set("settings", parsedData.data);
}

export async function getSettings() {
  return await settingsStore
    .get("settings")
    .then((item) => settingsSchema.parse(item));
}

export async function storeProgress(data: Progress[]) {
  const parsedData = z.array(ProgressSchema).safeParse(data);

  if (!parsedData.success) return;

  await sessionStore.set("progress", parsedData.data);

  await sessionStore.save(); // this manually saves the store, otherwise the store is only saved when your app is closed
}

export async function getProgress() {
  return await sessionStore
    .get("progress")
    .then((item) => z.array(ProgressSchema).parse(item));
}

// type TauriStoreOptions =
//   | {
//       file: "session";
//       values: SessionStore;
//     }
//   | {
//       file: "settings";
//       values: SettingsStore;
//     };

// export async function setTauriStore(options?: TauriStoreOptions) {
//   if(options?.file === "session"){
//     const
//   }
//   return await settingsStore
//     .get("settings")
//     .then((item) => settingsSchema.parse(item));
// }

// export async function getTauriStore(options?: TauriStoreOptions) {
//   return await settingsStore
//     .get("settings")
//     .then((item) => settingsSchema.parse(item));
// }
