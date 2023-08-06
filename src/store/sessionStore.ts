import { shuffleSchema } from "@/models";
import { Progress, StoreKeysEnum } from "@/store/common";
import { getProgress, sessionStore, storeProgress } from "@/store/systemStore";
import { z } from "zod";
import { create } from "zustand";

// TODO: migrate Sessions and progress to sqlite

const SessionSchema = z.object({
  id: z.string(),
  folders: z.array(
    z.object({
      path: z.string(),
      name: z.string(),
    }),
  ),
  name: z.string().nonempty(),
});

type Session = z.infer<typeof SessionSchema>;

type SessionId = "DEFAULT" | (string & {});

interface Store {
  /**
   * Selected session from saved sessions
   */
  sessionId?: SessionId;
  sessions: Session[];
  addSession: (val: Session) => void;
  editSession: (
    val: Partial<Session> & {
      id: SessionId;
    },
  ) => void;
  setSessions: (val: Session[]) => void;
  setSessionId: (val: SessionId) => void;
  removeSession: (id: SessionId) => void;
  progress: Progress[];
  saveProgress: (data: Progress) => void;
  setProgress: (data: Progress[]) => void;
}

export const useSessionStore = create<Store>()((set) => ({
  sessions: [],
  progress: [],
  saveProgress: (data) =>
    set((state) => {
      const foundIndex = state.progress.findIndex(
        (item) => item.sessionId === data.sessionId,
      );
      if (foundIndex === -1) {
        const newArr = [...state.progress, data];
        storeProgress(newArr);
        return {
          progress: newArr,
        };
      } else {
        const progress = [...state.progress];
        progress[foundIndex] = data;
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
  setProgress: (val) => set({ progress: val }),
  editSession: (val) =>
    set((state) => {
      const sessions = [...state.sessions];
      for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].id === val.id) {
          sessions[i] = {
            ...sessions[i],
            ...val,
          };
          break;
        }
      }
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

  if (!parsedSessions.success || parsedSessions.data.length === 0) {
    useSessionStore.getState().addSession({
      folders: [],
      id: "DEFAULT",
      name: "Default Session",
    });
    return;
  }

  if (!parsedSessions.success) return;

  if (parsedSessions.data) {
    useSessionStore.getState().setSessions(parsedSessions.data.slice(0, 30));
  }
}

async function loadProgress() {
  try {
    const progress = await getProgress();
    if (progress) {
      useSessionStore.getState().setProgress(progress);
    }
  } catch (err) {
    console.log(err);
  }
}

loadFromStorage();
loadProgress();
