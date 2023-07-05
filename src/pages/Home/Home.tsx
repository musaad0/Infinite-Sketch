import Folders from "@/pages/Home/Folders";
import { IntervalPicker } from "@/pages/Home/IntervalPicker";
import Control from "@/pages/Home/Control";
import { Moon, Sun } from "lucide-react";
import { AppContextMenu } from "@/AppContextMenu";
import { ThemeToggle } from "@/pages/Home/ThemeToggle";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // hacky way to fix some weird background issue caused by window transparency api
    // https://github.com/tauri-apps/tauri/issues/4881
    // we can't set background on body on all the time because want to be able to have a transparent window
    document.body.classList.add("bg-background");
  }, []);
  return (
    <AppContextMenu>
      <div className="h-screen">
        <ThemeToggle />
        <div className="max-w-sm mx-auto py-4 px-2">
          <Folders />
          <IntervalPicker />
          <Control />
        </div>
      </div>
    </AppContextMenu>
  );
}
