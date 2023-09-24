import { z } from "zod";

export const shuffleSchema = z.object({
  isShuffle: z.boolean(),
  seed: z.number(),
});

export type Shuffle = z.infer<typeof shuffleSchema>;
