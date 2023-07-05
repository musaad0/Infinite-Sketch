import { type } from "@tauri-apps/api/os";

export async function getOsType() {
  const osType = await type();
  return osType;
}
