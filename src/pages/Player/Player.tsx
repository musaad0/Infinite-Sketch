import "./styles.css";
import { useFoldersStore } from "@/store/foldersStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActionOnImage, usePlayerStore } from "@/store/playerStore";
import { IFile, Timer } from "@/models";
import { PlayerControls } from "@/pages/Player/PlayerControls";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { useBoolean, useInterval } from "@/hooks";
import { cn, convertInputToSecondsNumber, HHMMSS, shuffleList } from "@/utils";
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
          <CalculatePlayTime />
        </div>
      </div>
    </AppContextMenu>
  );
}

// save time played every something seconds
const INTERVAL_TO_SAVE = 15; // in seconds

function CalculatePlayTime() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const addTotalTimePlayed = usePlayerStore(
    (state) => state.addTotalTimePlayed,
  );
  const counter = useRef<number>(INTERVAL_TO_SAVE);
  useInterval(
    () => {
      addTotalTimePlayed(INTERVAL_TO_SAVE);
    },
    isPlaying ? 1000 * INTERVAL_TO_SAVE : null,
  );
  return <></>;
}

const imageTransformationsClassNames: Record<ActionOnImage, string> = {
  BLACK_AND_WHITE: "grayscale",
  FLIP_HORIZONTAL: "-scale-x-100",
  FLIP_VERTICAL: "-scale-y-100",
  GRID: "opacity-[96]",
  DISABLE_ZOOM: "",
};

function DisplayedImage({ files }: { files: IFile[] }) {
  const index = usePlayerStore((state) => state.index);
  // can't drag and drop image with zoom enable so we have to provide an option to disable zoom
  const imageGridWidthHeight = usePlayerStore(
    (state) => state.imageGridWidthHeight,
  );
  const actionOnImage = usePlayerStore((state) => state.actionsOnImage);
  return (
    <Avatar className="relative">
      <div className="relative mx-auto max-w-max overflow-hidden">
        {/* TODO: FIGURE OUT A WAY TO ALLOW DRAGGING AN IMAGE TO OUTSIDE APP WITHOUT REMOVING ZOOM */}
        {!actionOnImage.includes("DISABLE_ZOOM") ? (
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
        ) : (
          <AvatarImage
            src={files[index].path}
            className={cn(
              "mx-auto h-screen max-w-full object-contain animate-in fade-in duration-700",
              ...actionOnImage.map(
                (item) => imageTransformationsClassNames[item],
              ),
            )}
          />
        )}
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

function Countdown({ filesLength }: { filesLength: number }) {
  // The counter
  const currentIntervalImagesSeen = useRef<number>(0);
  const isBreak = useBoolean(false);
  const [selectedBreak, selectedBreakTime] = usePlayerStore((state) => [
    state.isBreak,
    state.breakTime,
  ]);
  const setIntervalIndex = usePlayerStore((state) => state.setIntervalIndex);
  const addImagesSeen = usePlayerStore((state) => state.addImagesSeen);
  const intervalIndex = useRef<number>(usePlayerStore.getState().intervalIndex);

  const intervals = usePlayerStore((state) => state.intervals);
  const imagesToDraw = usePlayerStore((state) => state.imagesToDraw);
  const interval =
    intervals[
      intervalIndex.current + 1 >= intervals.length
        ? intervals.length - 1
        : intervalIndex.current
    ].timer;

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
    return convertInputToSecondsNumber(interval);
  }, [index]);

  const breakInterval = useMemo(() => {
    let currentInterval = interval;

    if (playMode === "fixed" || playMode === "quantity") {
      currentInterval = selectedBreakTime;
    } else if (playMode === "class") {
      const currentClassInterval = intervals[intervalIndex.current];
      const breakAfterSectionEndsTime =
        currentClassInterval.break?.breakAfterSectionEndsTime;
      if (
        currentIntervalImagesSeen.current ===
          currentClassInterval.imagesToPlay &&
        breakAfterSectionEndsTime
      ) {
        currentInterval = breakAfterSectionEndsTime;
      } else {
        currentInterval =
          currentClassInterval.break?.breakBetweenEachImageTime ??
          selectedBreakTime;
      }
    }

    return convertInputToSecondsNumber(currentInterval);
  }, [index]);

  useEffect(() => {
    setIsPlaying(true);
    usePlayerStore.subscribe(
      (state) => (intervalIndex.current = state.intervalIndex),
    );
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
            currentIntervalImagesSeen.current += 1;
            // append one to total seen images
            addImagesSeen(1);
            // if last image
            if (filesLength - 1 === index) {
              setIndex(0);
              setIsPlaying(false);
              return;
            }
            // check if there is a break
            if (
              (playMode === "fixed" || playMode === "quantity") &&
              selectedBreak
            ) {
              isBreak.setTrue();
            } else if (playMode === "class") {
              const currentClassInterval = intervals[intervalIndex.current];
              const currentClassBreak = currentClassInterval.break;
              if (
                currentIntervalImagesSeen.current ===
                currentClassInterval.imagesToPlay
              ) {
                isBreak.setValue(
                  !!currentClassBreak?.breakAfterSectionEndsTime,
                );
                setIntervalIndex(intervalIndex.current + 1);

                currentIntervalImagesSeen.current = 0;
              } else {
                isBreak.setValue(
                  !!currentClassBreak?.breakBetweenEachImageTime,
                );
              }
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
          duration={breakInterval}
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
