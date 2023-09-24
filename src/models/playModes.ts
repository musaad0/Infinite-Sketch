import { z } from "zod";

const PLAY_MODES = ["fixed", "quantity", "class"] as const;

export const playModesEnum = z.enum(PLAY_MODES);
