import "./styles.css";
import { useFoldersStore } from "@/store/foldersStore";
import { useEffect, useState } from "react";
import { ActionOnImage, Timer, usePlayerStore } from "@/store/playerStore";
import { IFile } from "@/models";
import { PlayerControls } from "@/pages/Player/PlayerControls";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { useInterval } from "usehooks-ts";
import { cn, shuffleList } from "@/utils";
import { AppContextMenu } from "@/AppContextMenu";
import { useAppStore } from "@/store";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {};

export function Player({}: Props) {
  const [files, setFiles] = useState<IFile[]>([]);
  const folders = useFoldersStore((state) => state.folders);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const setShuffle = usePlayerStore((state) => state.setShuffle);
  const windowOpacity = useAppStore((state) => state.windowOpacity);

  useEffect(() => {
    const flatFiles = folders.map((item) => item.files).flat();
    if (shuffle.isShuffle) {
      const randomSeed = Math.floor(Math.random() * 10000 + 1);
      setFiles(shuffleList(flatFiles, shuffle.seed || randomSeed));
      // if there is no existing shuffle seed save the new one
      if (!shuffle.seed) {
        setShuffle({
          isShuffle: true,
          seed: randomSeed,
        });
      }
    } else {
      setFiles(flatFiles);
    }
  }, [folders, shuffle.isShuffle]);

  useEffect(() => {
    // hacky way to fix some weird background issue caused by window transparency api
    // https://github.com/tauri-apps/tauri/issues/4881
    // we can't set background on body on all the time because want to be able to have a transparent window
    document.body.classList.remove("bg-background");
  }, []);

  return (
    <AppContextMenu>
      <div
        className="bg-background shadow-none h-screen"
        style={{ opacity: windowOpacity + "%" }}
      >
        <div>
          <Countdown filesLength={files.length} />
          {files.length && <DisplayedImage files={files} />}
          <PlayerControls filesLength={files.length} />
        </div>
      </div>
    </AppContextMenu>
  );
}

const imageTransformationsClassNames: Record<ActionOnImage, string> = {
  BLACK_AND_WHITE: "grayscale",
  FLIP_HORIZONTAL: "-scale-x-100",
  FLIP_VERTICAL: "-scale-y-100",
  GRID: "opacity-[96]",
};

function DisplayedImage({ files }: { files: IFile[] }) {
  const index = usePlayerStore((state) => state.index);
  const imageGridWidthHeight = usePlayerStore(
    (state) => state.imageGridWidthHeight
  );
  const actionOnImage = usePlayerStore((state) => state.actionsOnImage);
  return (
    <Avatar className="relative">
      <div className="overflow-hidden max-w-max relative mx-auto">
        <TransformWrapper
          wheel={{
            smoothStep: 0.002,
          }}
        >
          <TransformComponent>
            <AvatarImage
              src={files[index].path}
              className={cn(
                "mx-auto object-contain max-w-full h-screen fade-in animate-in duration-700",
                ...actionOnImage.map(
                  (item) => imageTransformationsClassNames[item]
                )
              )}
            />
          </TransformComponent>
        </TransformWrapper>
        {actionOnImage.includes("GRID") && (
          <div
            style={{
              backgroundSize: `${imageGridWidthHeight}px ${imageGridWidthHeight}px`,
            }}
            className="w-full h-full [background-image:repeating-linear-gradient(#ccc_0_1px,transparent_1px_100%),repeating-linear-gradient(90deg,#ccc_0_1px,transparent_1px_100%)] m-0 z-10 absolute top-0"
          />
        )}
      </div>
      <AvatarFallback
        delayMs={200}
        className="flex justify-center items-center h-screen"
      >
        <Pencil className="animate-spin" />
      </AvatarFallback>
    </Avatar>
  );
}

function convertInputToSecondsNumber(intervalInput: Timer) {
  const lastInputChar = intervalInput[intervalInput.length - 1].toLowerCase();
  if (typeof lastInputChar === "string" && lastInputChar === "m") {
    // convert minutes to seconds
    return parseInt(intervalInput, 10) * 60;
  }
  // seconds is default
  return parseInt(intervalInput, 10);
}

function Countdown({ filesLength }: { filesLength: number }) {
  // The counter
  const interval = usePlayerStore((state) => state.timer);
  const [count, setCount] = useState<number>(
    convertInputToSecondsNumber(interval)
  );
  // ON/OFF
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const nextIndex = usePlayerStore((state) => state.nextIndex);
  const index = usePlayerStore((state) => state.index);

  const resetCounter = () => {
    setCount(convertInputToSecondsNumber(interval));
  };

  useInterval(
    () => {
      // Your custom logic here
      if (count === 0) {
        resetCounter();
        // if last image
        if (filesLength === index) return;
        nextIndex();
        return;
      }
      setCount(count - 1);
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? 1000 : null
  );

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    resetCounter();
  }, [index]);

  return (
    <div className="absolute right-0 top-0 text-white p-4 backdrop-blur-sm bg-slate-600/50 rounded-xl m-4 w-14 h-14 flex z-20 justify-center items-center">
      <span className="countdown">
        {/* typescript doesn't like --value so ignore */}
        {/* @ts-ignore */}
        <span style={{ "--value": `${count}` }}></span>
      </span>
    </div>
  );
}
