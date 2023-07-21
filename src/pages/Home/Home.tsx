import Folders from "@/pages/Home/Folders";
import Control from "@/pages/Home/Control";
import { AppContextMenu } from "@/AppContextMenu";
import { ThemeToggle } from "@/pages/Home/ThemeToggle";
import { useEffect } from "react";
import { PlayModes } from "@/pages/Home/PlayModes";
import Stats from "@/pages/Home/Stats";

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
        <ThemeToggle />
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
