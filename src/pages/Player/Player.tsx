import "./styles.css";
import { useFoldersStore } from "@/store/foldersStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActionOnImage, usePlayerStore } from "@/store/playerStore";
import { IFile, Timer } from "@/models";
import { PlayerControls } from "@/pages/Player/PlayerControls";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { useBoolean } from "@/hooks";
import { cn, HHMMSS, shuffleList } from "@/utils";
import { AppContextMenu } from "@/AppContextMenu";
import { shallow, useAppStore } from "@/store";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { CountdownCircleTimer } from "./CountdownCircleTimer";

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
        className="h-screen bg-background shadow-none"
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
    (state) => state.imageGridWidthHeight,
  );
  const actionOnImage = usePlayerStore((state) => state.actionsOnImage);
  return (
    <Avatar className="relative">
      <div className="relative mx-auto max-w-max overflow-hidden">
        <TransformWrapper
          wheel={{
            smoothStep: 0.002,
          }}
        >
          <TransformComponent>
            <AvatarImage
              src={files[index].path}
              className={cn(
                "mx-auto h-screen max-w-full object-contain animate-in fade-in duration-700",
                ...actionOnImage.map(
                  (item) => imageTransformationsClassNames[item],
                ),
              )}
            />
          </TransformComponent>
        </TransformWrapper>
        {actionOnImage.includes("GRID") && (
          <div
            style={{
              backgroundSize: `${imageGridWidthHeight}px ${imageGridWidthHeight}px`,
            }}
            className="absolute top-0 z-10 m-0 h-full w-full [background-image:repeating-linear-gradient(#ccc_0_1px,transparent_1px_100%),repeating-linear-gradient(90deg,#ccc_0_1px,transparent_1px_100%)]"
          />
        )}
      </div>
      <AvatarFallback
        delayMs={200}
        className="flex h-screen items-center justify-center"
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
  const currentIntervalImagesSeen = useRef<number>(0);
  // const isBreak = useRef<boolean>(false);
  const isBreak = useBoolean(false);
  const classModeIndex = useRef<number>(0);

  const intervals = usePlayerStore((state) => state.intervals);
  const imagesToDraw = usePlayerStore((state) => state.imagesToDraw);
  const interval = intervals[classModeIndex.current].timer;

  const [isPlaying, setIsPlaying] = usePlayerStore(
    (state) => [state.isPlaying, state.setIsPlaying],
    shallow,
  );
  const [index, nextIndex, setIndex] = usePlayerStore(
    (state) => [state.index, state.nextIndex, state.setIndex],
    shallow,
  );

  const playMode = usePlayerStore((state) => state.playMode);

  const curInt = useMemo(() => {
    let currentInterval = interval;
    // Class mode stuff
    if (playMode === "class") {
      const currentClassInterval = intervals[classModeIndex.current];
      if (
        currentIntervalImagesSeen.current === currentClassInterval.imagesToPlay
      ) {
        currentInterval =
          currentClassInterval.break?.breakAfterSectionEndsTime ?? interval;
        isBreak.setValue(
          !!currentClassInterval.break?.breakAfterSectionEndsTime,
        );
        classModeIndex.current += 1;
        currentIntervalImagesSeen.current = 0;
      } else {
        currentInterval =
          currentClassInterval.break?.breakBetweenEachImageTime ?? interval;
        isBreak.setValue(
          !!currentClassInterval.break?.breakBetweenEachImageTime,
        );
      }
    }

    return convertInputToSecondsNumber(currentInterval);
  }, [index]);

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  return (
    <>
      {/* We have Seperate divs because one div that moves around has laggy animations when a large image loads */}
      <div className="absolute right-0 top-0 z-20 m-4 rounded-full bg-slate-600/50 backdrop-blur">
        <CountdownCircleTimer
          isPlaying={isPlaying && !isBreak.value}
          duration={curInt}
          size={80}
          strokeWidth={4}
          key={index}
          // this won't be set --> this is just for typescript --> enter component to see color
          colors="#"
          onComplete={() => {
            // if last image
            if (filesLength - 1 === index) {
              setIndex(0);
              setIsPlaying(false);
              return;
            }
            if (
              playMode === "quantity" &&
              currentIntervalImagesSeen.current === imagesToDraw
            ) {
              setIndex(0);
              setIsPlaying(false);
              return;
            }

            nextIndex();
            currentIntervalImagesSeen.current += 1;

            return { shouldRepeat: true, delay: 0 };
          }}
        >
          {({ remainingTime }) => <span>{HHMMSS(remainingTime)}</span>}
        </CountdownCircleTimer>
      </div>
      <div
        className={cn(
          "absolute left-1/2 top-1/2  z-20 m-4 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-600/50 p-4 text-[8rem] text-white backdrop-blur transition-opacity animate-in fade-in duration-700 ",
          isBreak.value && "block",
        )}
      >
        <CountdownCircleTimer
          isPlaying={isBreak.value}
          strokeWidth={4}
          key={index}
          size={300}
          duration={curInt}
          colors="#"
          onComplete={() => {
            isBreak.setFalse();
          }}
        >
          {({ remainingTime }) => <span>{remainingTime}</span>}
        </CountdownCircleTimer>
      </div>
    </>
  );
}
