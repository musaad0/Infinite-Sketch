import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { usePlayerStore } from "@/store/playerStore";
import {
  FlipHorizontal2,
  Grid,
  Home,
  Pause,
  Play,
  Save,
  SearchX,
  Square,
  StepBack,
  StepForward,
  SunMoon,
} from "lucide-react";
import { useHotkeys, useNavigate } from "@/hooks";
import React, { ReactNode, useState } from "react";
import { useFoldersStore } from "@/store/foldersStore";
import { storeSessionData } from "@/store/systemStore";
import { useAppStore } from "@/store";
import { keybindForOs } from "@/utils";
import { ModifierKeys } from "@/constants";

type Props = {
  filesLength: number;
};

export function PlayerControls({ filesLength }: Props) {
  const nextIndex = usePlayerStore((state) => state.nextIndex);
  const previousIndex = usePlayerStore((state) => state.previousIndex);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const toggleActionOnImage = usePlayerStore(
    (state) => state.toggleActionOnImage,
  );
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const index = usePlayerStore((state) => state.index);
  const os = useAppStore((state) => state.os);

  const handlePrev = () => {
    if (index === 0) return;
    previousIndex();
  };
  const handleNext = () => {
    if (index + 1 === filesLength) return;
    nextIndex();
  };

  useHotkeys(["ArrowRight"], handleNext);
  useHotkeys(["ArrowLeft"], handlePrev);
  useHotkeys(["p"], () => setIsPlaying(!isPlaying));
  useHotkeys(["mod+G"], () => toggleActionOnImage("GRID"), {
    preventDefault: true,
  });
  useHotkeys(["mod+H"], () => toggleActionOnImage("FLIP_HORIZONTAL"));
  useHotkeys(["mod+B"], () => toggleActionOnImage("BLACK_AND_WHITE"));
  useHotkeys(["mod+Z"], () => toggleActionOnImage("DISABLE_ZOOM"));
  const keybind = keybindForOs(os);

  return (
    <div className="fixed bottom-0 left-0 z-50 h-7 w-full bg-primary/60 opacity-0  backdrop-blur-sm transition-opacity hover:opacity-100">
      <div className="mx-auto grid h-full max-w-lg grid-cols-8 font-medium">
        <PlayerControlButton
          toolTipContent="←"
          onClick={handlePrev}
          icon={<StepBack className="h-4 w-4" />}
        />
        <PlayerControlButton
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          toolTipContent="P"
          icon={
            isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )
          }
        />
        <PlayerControlButton
          toolTipContent="→"
          onClick={handleNext}
          icon={<StepForward className="h-4 w-4" />}
        />
        {/* Maybe not usefull so hide it and wait for feedback */}
        {/* <PlayerControlButton
          onClick={() => toggleActionOnImage("FLIP_VERTICAL")}
          icon={<FlipVertical2 className="w-4 h-4" />}
        /> */}

        <PlayerControlButton
          onClick={() => toggleActionOnImage("FLIP_HORIZONTAL")}
          toolTipContent={keybind([ModifierKeys.Control], ["H"])}
          icon={<FlipHorizontal2 className="h-4 w-4" />}
        />
        <PlayerControlButton
          toolTipContent={keybind([ModifierKeys.Control], ["B"])}
          onClick={() => toggleActionOnImage("BLACK_AND_WHITE")}
          icon={<SunMoon className="h-4 w-4" />}
        />
        <ImageGridButton
          keybind={keybind([ModifierKeys.Control], ["G"])}
          button={
            <button
              className={
                "group inline-flex flex-col items-center justify-center px-5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground/80 focus:text-primary-foreground/80 focus:outline-none"
              }
            >
              <Grid className="h-4 w-4" />{" "}
            </button>
          }
        />
        <PlayerControlButton
          onClick={() => toggleActionOnImage("DISABLE_ZOOM")}
          toolTipContent={
            <div>
              Disable Zoom: &nbsp;
              {keybind([ModifierKeys.Control], ["Z"])}
            </div>
          }
          icon={<SearchX className="h-4 w-4" />}
        />
        <EndSessionDialog
          button={
            <PlayerControlButton
              onClick={() => {}}
              toolTipContent={keybind([], ["Q"])}
              icon={<Square className="h-4 w-4" />}
            />
          }
        />
      </div>
    </div>
  );
}

interface PlayerControlButton {
  icon: ReactNode;
  onClick?: () => void;
  toolTipContent: ReactNode;
}

//  TODO: Investigate later why tooltip and this don't work together
const PlayerControlButton = React.forwardRef<
  HTMLButtonElement,
  PlayerControlButton
>(({ onClick, icon, toolTipContent }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          type="button"
          ref={ref}
          onClick={onClick}
          className="group inline-flex flex-col items-center justify-center px-5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground/80 focus:text-primary-foreground/80 focus:outline-none"
        >
          {icon}
        </TooltipTrigger>
        <TooltipContent className="pointer-events-none flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium opacity-100">
          {toolTipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

function ImageGridButton({
  button,
  keybind,
}: {
  button: ReactNode;
  keybind: string;
}) {
  const imageGridWidthHeight = usePlayerStore(
    (state) => state.imageGridWidthHeight,
  );
  const toggleActionOnImage = usePlayerStore(
    (state) => state.toggleActionOnImage,
  );
  const actionOnImage = usePlayerStore((state) => state.actionsOnImage);
  const setImageGridWidthHeight = usePlayerStore(
    (state) => state.setImageGridWidthHeight,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent>
        <div className="mb-4 flex items-center gap-2 py-2">
          <Switch
            checked={!!actionOnImage.includes("GRID")}
            onCheckedChange={(e) => {
              toggleActionOnImage("GRID");
            }}
            id="image-grid"
          />
          <Label htmlFor="image-grid">Toggle Grid</Label>
          <div className="pointer-events-none ms-auto h-5 items-center rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            {keybind}
          </div>
        </div>
        <Slider
          onValueChange={(e) => {
            setImageGridWidthHeight(e[0]);
          }}
          defaultValue={[imageGridWidthHeight]}
          max={100}
          step={1}
        />
      </PopoverContent>
    </Popover>
  );
}

function EndSessionDialog({ button }: { button: ReactNode }) {
  const [open, setOpen] = useState(false);
  const folders = useFoldersStore((state) => state.folders);
  const index = usePlayerStore((state) => state.index);
  const playMode = usePlayerStore((state) => state.playMode);
  const [isBreak, breakTime] = usePlayerStore((state) => [
    state.isBreak,
    state.breakTime,
  ]);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const intervalIndex = usePlayerStore((state) => state.intervalIndex);
  const navigate = useNavigate();

  useHotkeys(["Q"], () => {
    setOpen(true);
  });

  const handleSave = () => {
    storeSessionData({
      folders: folders.map((item) => item.path),
      playMode: playMode,
      index,
      intervalIndex: intervalIndex,
      breakTime: breakTime,
      isBreak: isBreak,
      shuffle,
    });
    navigate("/");
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle> Save & Quit ?</DialogTitle>
          <DialogDescription>
            You can save your current progress and continue later
          </DialogDescription>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <Button onClick={handleSave}>
            <Save className="me-2 h-4 w-4" />
            Save
          </Button>
          <Button
            className="mb-2 sm:mb-0"
            variant={"ghost"}
            onClick={handleNavigateHome}
          >
            <Home className="me-2 h-4 w-4" />
            Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
