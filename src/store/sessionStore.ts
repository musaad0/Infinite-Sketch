import { shuffleSchema } from "@/models";
import { Progress, StoreKeysEnum } from "@/store/common";
import { sessionStore, storeProgress } from "@/store/systemStore";
import { z } from "zod";
import { create } from "zustand";

const SessionSchema = z.object({
  id: z.string(),
  folders: z.array(
    z.object({
      path: z.string(),
      name: z.string(),
    }),
  ),
  name: z.string().nonempty(),
  index: z.number().optional(),
  shuffle: shuffleSchema.optional(),
});

type Session = z.infer<typeof SessionSchema>;

interface Store {
  /**
   * Selected session from saved sessions
   */
  sessionId: string;
  sessions: Session[];
  addSession: (val: Session) => void;
  editSession: (val: Session) => void;
  setSessions: (val: Session[]) => void;
  setSessionId: (val: string) => void;
  removeSession: (id: string) => void;
  progress: Progress[];
  saveProgress: (data: Progress) => void;
}

export const useSessionStore = create<Store>()((set) => ({
  sessions: [],
  sessionId: "DEFAULT",
  progress: [],
  saveProgress: (data) =>
    set((state) => {
      const foundIndex = state.progress.findIndex((item) => item.sessionId);
      if (foundIndex === -1) {
        const newArr = [...state.progress, data];
        storeProgress(newArr);
        return {
          progress: [...state.progress, data],
        };
      } else {
        const progress = [...state.progress];
        progress[foundIndex] = {
          ...data,
        };
        storeProgress(progress);
        return {
          progress: progress,
        };
      }
    }),
  setSessionId: (val) => set({ sessionId: val }),
  addSession: (val) =>
    set((state) => {
      const sessions = [...state.sessions, val];
      sessionStore.set(StoreKeysEnum.Enum.sessions, sessions);
      return {
        sessions: sessions,
      };
    }),
  setSessions: (val) =>
    set((state) => {
      const sessions = [...state.sessions, ...val];
      sessionStore.set(StoreKeysEnum.Enum.sessions, sessions);
      return {
        sessions: sessions,
      };
    }),
  editSession: (val) =>
    set((state) => {
      const sessions = [...state.sessions, val];

      sessionStore.set(StoreKeysEnum.Enum.sessions, sessions);
      return {
        sessions: sessions,
      };
    }),
  removeSession: (val) =>
    set((state) => {
      const sessions = state.sessions.filter((item) => item.id !== val);
      // remove related progress
      const progress = state.progress.filter((item) => item.sessionId !== val);
      sessionStore.set(StoreKeysEnum.Enum.sessions, sessions);
      storeProgress(progress);
      return {
        sessions: sessions,
        progress: progress,
      };
    }),
}));

async function loadFromStorage() {
  const sessions = await sessionStore.get(StoreKeysEnum.Enum.sessions);

  const parsedSessions = z.array(SessionSchema).safeParse(sessions);

  if (!parsedSessions.success) return;
  if (parsedSessions.data.length === 0) {
    useSessionStore.getState().addSession({
      folders: [],
      id: "DEFAULT",
      name: "Default Session",
    });
    return;
  }
  if (parsedSessions.data) {
    useSessionStore.getState().setSessions(parsedSessions.data.slice(0, 30));
  }
}

loadFromStorage();
