import { THEMES } from "@/constants";
import { z } from "zod";

export const ThemeScema = z.enum(THEMES);

export type Theme = z.infer<typeof ThemeScema>;
