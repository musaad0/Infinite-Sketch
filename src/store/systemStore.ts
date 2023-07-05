import { ThemeScema, shuffleSchema } from "@/models";
import { Store } from "tauri-plugin-store-api";
import { z } from "zod";

const sessionSchema = z.object({
  index: z.number(),
  folders: z.array(z.string()),
  shuffle: shuffleSchema,
});

const settingsSchema = z.object({
  alwaysOnTop: z.boolean().optional(),
  theme: ThemeScema.optional(),
});

type SessionStore = z.infer<typeof sessionSchema>;

export type SettingsStore = z.infer<typeof settingsSchema>;

const settingsStore = new Store(".settings.dat");
const sessionStore = new Store("session");

export async function storeSessionData(data: SessionStore) {
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
