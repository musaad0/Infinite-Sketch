import { z } from "zod";

import { shuffleSchema } from "@/models";

export const StoreKeysEnum = z.enum(["sessions"]);

export const ProgressSchema = z.object({
  index: z.number(),
  intervalIndex: z.number(),
  sessionId: z.string(),
  shuffle: shuffleSchema,
});

export type Progress = z.infer<typeof ProgressSchema>;
