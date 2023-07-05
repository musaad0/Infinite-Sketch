import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
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
  FlipVertical2,
  Grid,
  Home,
  Pause,
  Play,
  Save,
  Square,
  StepBack,
  StepForward,
  SunMoon,
} from "lucide-react";
import { useHotkeys, useNavigate } from "@/hooks";
import React, { ReactNode, useEffect, useState } from "react";
import { useFoldersStore } from "@/store/foldersStore";
import { storeSessionData } from "@/store/systemStore";
import { useAppStore } from "@/store";
import { keybindForOs } from "@/utils";
import { ModifierKeys, keySymbols } from "@/constants";

type Props = {
  filesLength: number;
};

export function PlayerControls({ filesLength }: Props) {
  const nextIndex = usePlayerStore((state) => state.nextIndex);
  const previousIndex = usePlayerStore((state) => state.previousIndex);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const toggleActionOnImage = usePlayerStore(
    (state) => state.toggleActionOnImage
  );
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const index = usePlayerStore((state) => state.index);
  const os = useAppStore((state) => state.os);

  useHotkeys(["ArrowRight"], () => nextIndex());
  useHotkeys(["ArrowLeft"], () => previousIndex());
  useHotkeys(["p"], () => setIsPlaying(!isPlaying));
  useHotkeys(["mod+G"], () => toggleActionOnImage("GRID"), {
    preventDefault: true,
  });
  useHotkeys(["mod+H"], () => toggleActionOnImage("FLIP_HORIZONTAL"));
  useHotkeys(["mod+B"], () => toggleActionOnImage("BLACK_AND_WHITE"));
  const keybind = keybindForOs(os);

  // No component for playerButton because of issues with refs
  const buttonClassName =
    "inline-flex flex-col items-center justify-center px-5 hover:bg-primary-foreground/10 group text-primary-foreground/70 hover:text-primary-foreground/80 transition-colors focus:text-primary-foreground/80 focus:bg-primary-foreground/10 focus:outline-none";

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-7 bg-primary/60 backdrop-blur-sm  opacity-100 hover:opacity-100 transition-opacity">
      <div className="grid h-full max-w-lg grid-cols-7 mx-auto font-medium">
        <PlayerControlButton
          toolTipContent="←"
          onClick={() => {
            if (index === 0) return;
            previousIndex();
          }}
          icon={<StepBack className="w-4 h-4" />}
        />
        <PlayerControlButton
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          toolTipContent="P"
          icon={
            isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )
          }
        />
        <PlayerControlButton
          toolTipContent="→"
          onClick={() => {
            if (index + 1 === filesLength) return;
            nextIndex();
          }}
          icon={<StepForward className="w-4 h-4" />}
        />
        {/* Maybe not usefull so hide it and wait for feedback */}
        {/* <PlayerControlButton
          onClick={() => toggleActionOnImage("FLIP_VERTICAL")}
          icon={<FlipVertical2 className="w-4 h-4" />}
        /> */}

        <PlayerControlButton
          onClick={() => toggleActionOnImage("FLIP_HORIZONTAL")}
          toolTipContent={keybind([ModifierKeys.Control], ["H"])}
          icon={<FlipHorizontal2 className="w-4 h-4" />}
        />
        <PlayerControlButton
          toolTipContent={keybind([ModifierKeys.Control], ["B"])}
          onClick={() => toggleActionOnImage("BLACK_AND_WHITE")}
          icon={<SunMoon className="w-4 h-4" />}
        />
        <ImageGridButton
          keybind={keybind([ModifierKeys.Control], ["G"])}
          button={
            <button className={buttonClassName}>
              <Grid className="w-4 h-4" />{" "}
            </button>
          }
        />
        <EndSessionDialog
          button={
            <PlayerControlButton
              onClick={() => {}}
              toolTipContent={keybind([], ["Escape"])}
              icon={<Square className="w-4 h-4" />}
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
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-foreground/10 group text-primary-foreground/70 hover:text-primary-foreground/80 transition-colors focus:text-primary-foreground/80 focus:bg-primary-foreground/10 focus:outline-none"
        >
          {icon}
        </TooltipTrigger>
        <TooltipContent className="pointer-events-none h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium opacity-100 flex">
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
    (state) => state.imageGridWidthHeight
  );
  const toggleActionOnImage = usePlayerStore(
    (state) => state.toggleActionOnImage
  );
  const actionOnImage = usePlayerStore((state) => state.actionsOnImage);
  const setImageGridWidthHeight = usePlayerStore(
    (state) => state.setImageGridWidthHeight
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-2 mb-4 py-2">
          <Switch
            checked={!!actionOnImage.includes("GRID")}
            onCheckedChange={(e) => {
              toggleActionOnImage("GRID");
            }}
            id="image-grid"
          />
          <Label htmlFor="image-grid">Toggle Grid</Label>
          <div className="pointer-events-none h-5 items-center rounded border bg-muted px-1.5 font-mono font-medium opacity-100 sm:flex text-xs ms-auto">
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
  const shuffle = usePlayerStore((state) => state.shuffle);
  const navigate = useNavigate();

  useHotkeys(["esc"], () => {
    setOpen(true);
  });

  const handleSave = () => {
    storeSessionData({
      folders: folders.map((item) => item.path),
      index,
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
            <Save className="w-4 h-4 me-2" />
            Save
          </Button>
          <Button
            className="mb-2 sm:mb-0"
            variant={"ghost"}
            onClick={handleNavigateHome}
          >
            <Home className="w-4 h-4 me-2" />
            Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
