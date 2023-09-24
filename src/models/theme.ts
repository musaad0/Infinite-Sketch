import { z } from "zod";

import { THEMES } from "@/constants";

export const ThemeScema = z.enum(THEMES);

export type Theme = z.infer<typeof ThemeScema>;
