import { ReactNode, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Slider,
} from "@/components";

import { shallow, useAppStore } from "@/store";

import { ModifierKeys, modifierSymbols } from "@/constants";
import { useHotkeys } from "@/hooks";
import { keybindForOs } from "@/utils";

export function AppContextMenu({ children }: { children: ReactNode }) {
  const {
    os,
    alwaysOnTop,
    windowOpacity,
    setWindowOpacity,
    windowBordersBars,
    setWindowBordersBars,
    setSlwaysOnTop,
    setTransparentToMouse,
    transparentToMouse,
  } = useAppStore(
    (state) => ({
      alwaysOnTop: state.alwaysOnTop,
      windowOpacity: state.windowOpacity,
      os: state.os,
      windowBordersBars: state.windowBordersBars,
      setWindowBordersBars: state.setWindowBordersBars,
      setWindowOpacity: state.setWindowOpacity,
      setSlwaysOnTop: state.setAlwaysOnTop,
      transparentToMouse: state.transparentToMouse,
      setTransparentToMouse: state.setTransparentToMouse,
    }),
    shallow,
  );

  const keybind = keybindForOs(os);
  const [transparentToMouseDialog, setTransparentToMouseDialog] =
    useState(false);

  // shortcuts
  useHotkeys(["mod+T"], () => {
    if (transparentToMouse) setTransparentToMouse(false);
    // we want to confirm with the user before continuing
    else setTransparentToMouseDialog(true);
  });
  const transparentToMouseKeybind = keybind([ModifierKeys.Control], ["T"]);

  useHotkeys(["mod+shift+A"], () => setSlwaysOnTop(!alwaysOnTop));
  const alwaysOnTopKeybind = keybind(
    [ModifierKeys.Control, ModifierKeys.Shift],
    ["A"],
  );

  useHotkeys(["mod+J"], () => setWindowOpacity(windowOpacity - 5));
  const windowOpacityDecKeybind = keybind([ModifierKeys.Control], ["J"]);

  useHotkeys(["mod+K"], () => setWindowOpacity(windowOpacity + 5));
  const windowOpacityIncKeybind = keybind([ModifierKeys.Control], ["K"]);

  useHotkeys(["mod+W"], () => setWindowBordersBars(!windowBordersBars));
  const windowBordersKeybind = keybind([ModifierKeys.Control], ["W"]);

  // prevent default shortcuts
  useHotkeys(["mod+f"], () => {}, { preventDefault: true });

  // prevent default context menu
  useEffect(() => {
    const handleDefaultContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleDefaultContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleDefaultContextMenu);
    };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-72">
        <ContextMenuCheckboxItem
          onCheckedChange={(checked) => {
            setSlwaysOnTop(checked);
          }}
          checked={alwaysOnTop}
        >
          Always On Top
          <ContextMenuShortcut>{alwaysOnTopKeybind}</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          onClick={() => setTransparentToMouseDialog(true)}
          checked={transparentToMouse}
        >
          Transparent To Mouse
          <ContextMenuShortcut>{transparentToMouseKeybind}</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          onCheckedChange={(checked) => {
            setWindowBordersBars(checked);
          }}
          checked={windowBordersBars}
        >
          Window Borders
          <ContextMenuShortcut>{windowBordersKeybind}</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuItem inset>
          Player Opacity
          <ContextMenuShortcut>
            {windowOpacityDecKeybind} | {windowOpacityIncKeybind}
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="focus:bg-transparent mt-1" inset>
          <Slider
            onValueChange={(e) => {
              setWindowOpacity(e[0]);
            }}
            value={[windowOpacity]}
            max={100}
            min={0}
          />
        </ContextMenuItem>
      </ContextMenuContent>
      <TransparentToMouseDialogWarning
        open={transparentToMouseDialog}
        keybind={transparentToMouseKeybind}
        onConfirmClick={() => {
          setTransparentToMouse(!transparentToMouse);
        }}
        setOpen={(val) => setTransparentToMouseDialog(val)}
      />
    </ContextMenu>
  );
}

function TransparentToMouseDialogWarning({
  open,
  setOpen,
  onConfirmClick,
  keybind,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  onConfirmClick: () => void;
  keybind: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            The only way to reset this option will be through the keyboard
            shortcut ({keybind}) or by restarting the app
            <br />
            <br />
            Hint: The window has to be on focus to use the shorcut (click the
            app on the taskbar to regain focus)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
