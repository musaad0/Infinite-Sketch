import { z } from "zod";

const fileSchema = z.object({
  name: z.string(),
  path: z.string(),
});

export type IFile = z.infer<typeof fileSchema>;

export const folderSchema = z.object({
  name: z.string(),
  path: z.string(),
  id: z.string(),
  files: z.array(fileSchema),
});

export type IFolder = z.infer<typeof folderSchema>;
