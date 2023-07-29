import Folders from "@/pages/Home/Folders";
import Control from "@/pages/Home/Control";
import { AppContextMenu } from "@/AppContextMenu";
import { ThemeToggle } from "@/pages/Home/ThemeToggle";
import { useEffect } from "react";
import { PlayModes } from "@/pages/Home/PlayModes";
import Stats from "@/pages/Home/Stats";
import { Settings2 } from "lucide-react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "@/components";
import { usePlayerStore } from "@/store";
import { storeSessionData } from "@/store/systemStore";

export default function Home() {
  useEffect(() => {
    // hacky way to fix some weird background issue caused by window transparency api
    // https://github.com/tauri-apps/tauri/issues/4881
    // we can't set background on body on all the time because want to be able to have a transparent window
    document.body.classList.add("bg-background");
  }, []);
  return (
    <AppContextMenu>
      <div className="min-h-screen">
        <div className="flex items-center">
          <ThemeToggle />
          <Settings />
        </div>
        <div className="mx-auto max-w-sm px-2 py-4">
          <Folders />
          <PlayModes />
          <Control />
          <Stats />
        </div>
      </div>
    </AppContextMenu>
  );
}

function Settings() {
  const playMode = usePlayerStore((state) => state.playMode);
  const [isBreak, breakTime] = usePlayerStore((state) => [
    state.isBreak,
    state.breakTime,
  ]);
  const shuffle = usePlayerStore((state) => state.shuffle);

  const handleSave = () => {
    const randomSeed = Math.floor(Math.random() * 10000 + 1);
    storeSessionData({
      playMode: playMode,
      imagesToDraw: usePlayerStore.getState().imagesToDraw,
      breakTime: breakTime,
      timer: usePlayerStore.getState().timer,
      classModeLength: usePlayerStore.getState().classModeLength,
      isBreak: isBreak,
      shuffle: {
        isShuffle: shuffle.isShuffle,
        seed: randomSeed,
      },
    });
    toast.success("Your current settings became the default");
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Settings2 />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save current settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
