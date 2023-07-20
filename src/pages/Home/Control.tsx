import { getFilesRecursively } from "@/apis/files";
import { Button, Progress, toast } from "@/components";
import { Toggle } from "@/components/ui/toggle";
import { CLASS_MODES } from "@/constants";
import { useFoldersStore, shallow } from "@/store";
import { usePlayerStore } from "@/store/playerStore";
import { getSessionData } from "@/store/systemStore";
import { Palmtree, Pen, Shuffle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

type Props = {};

export default function Control({}: Props) {
  const navigate = useNavigate();
  const files = useFoldersStore((state) => state.folders)
    .map((item) => item.files)
    .flat();
  const setFolders = useFoldersStore((state) => state.setFolders);
  const addFolder = useFoldersStore((state) => state.addFolder);
  const [index, setIndex] = usePlayerStore(
    (state) => [state.index, state.setIndex],
    shallow,
  );
  const [shuffle, setShuffle] = usePlayerStore(
    (state) => [state.shuffle, state.setShuffle],
    shallow,
  );
  const setIntervals = usePlayerStore((state) => state.setIntervals);
  const playMode = usePlayerStore((state) => state.playMode);

  const progress = Math.floor(((index + 1) / files.length) * 100);
  const progressVal =
    files.length && index ? (progress > 100 ? 100 : progress) : 0;

  const handleStart = () => {
    if (playMode === "fixed" || playMode === "quantity") {
      setIntervals([
        {
          timer: usePlayerStore.getState().timer,
          imagesToPlay:
            playMode === "fixed"
              ? files.length
              : usePlayerStore.getState().imagesToDraw,
          break: {},
        },
      ]);
    } else if (playMode === "class") {
      setIntervals(CLASS_MODES[usePlayerStore.getState().classModeLength]);
    }
    navigate("/player");
  };

  const loadSession = async () => {
    // if there are already uploaded files don't update the session
    const session = await getSessionData();
    setIndex(session.index);
    setShuffle(session.shuffle);
    const loadingToast = toast.loading("Adding Files... ");
    const folders = await getFilesRecursively(session.folders);
    folders?.forEach((item) => {
      addFolder(item);
    });
    toast.success("Added Files Successfully", {
      id: loadingToast,
    });
  };

  const reset = async () => {
    setIndex(0);
    setFolders([]);
    setShuffle({
      isShuffle: false,
      seed: 0,
    });
  };

  return (
    <div className="space-y-8 py-10">
      <Button disabled={!files.length} onClick={handleStart} className="w-full">
        <Pen className="me-2 h-4 w-4" />
        Start
      </Button>
      <div className="flex gap-4">
        <Button
          disabled={!!files.length}
          onClick={loadSession}
          className="w-full"
        >
          Load Session
        </Button>
        <Button variant={"outline"} onClick={reset}>
          Reset
        </Button>
        <Toggle
          onPressedChange={(val) =>
            setShuffle({
              isShuffle: val,
              seed: 0,
            })
          }
          pressed={shuffle.isShuffle}
        >
          <Shuffle className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-4">
        <Progress value={progressVal} />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
