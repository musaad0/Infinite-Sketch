import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { CLASS_MODE_OPTIONS } from "@/constants";
import { Timer } from "@/models";
import { PlayMode, usePlayerStore } from "@/store";
import { convertSecondsToReadableTime } from "@/utils";
import { useEffect, useState } from "react";

const tabs: Record<PlayMode, PlayMode> = {
  class: "class",
  fixed: "fixed",
  quantity: "quantity",
};

export function PlayModes() {
  const setPlayMode = usePlayerStore((state) => state.setPlayMode);
  const playMode = usePlayerStore((state) => state.playMode);

  return (
    <div>
      <Tabs
        onValueChange={(e) => setPlayMode(e as PlayMode)}
        value={playMode}
        defaultValue={tabs.fixed}
        className="w-full"
      >
        <TabsList
          defaultValue={playMode}
          className="grid w-full grid-cols-3 my-5"
        >
          <TabsTrigger value={tabs.fixed}>Fixed</TabsTrigger>
          <TabsTrigger value={tabs.class}>Class</TabsTrigger>
          <TabsTrigger value={tabs.quantity}> Quantity</TabsTrigger>
        </TabsList>
        <TabsContent value={tabs.fixed}>
          <IntervalPicker />
        </TabsContent>
        <TabsContent value={tabs.class}>
          <ClassMode />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IntervalPicker() {
  const [inputValue, setInputValue] = useState<string>("30s");
  const setTimer = usePlayerStore((state) => state.setTimer);

  useEffect(() => {
    if (inputValue) {
      const regex = /^\d+[hsm]$/.test(inputValue);
      if (regex) setTimer(inputValue as Timer);
    }
  }, [inputValue]);

  return (
    <div>
      <span className="isolate inline-flex rounded-md shadow-sm">
        {(["30s", "45s", "2m", "5m"] as const).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              setInputValue(item);
            }}
            className="relative -ml-px inline-flex items-center first:rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            {item}
          </button>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none rounded-r-md"
        />
      </span>
    </div>
  );
}

function ClassMode() {
  const setClassModeLength = usePlayerStore(
    (state) => state.setClassModeLength
  );
  return (
    <div>
      <Select onValueChange={setClassModeLength}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="overflow-visible">
          <SelectGroup>
            {CLASS_MODE_OPTIONS.map((item) => (
              <TooltipProvider key={item}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <SelectItem value={item}>
                      {convertSecondsToReadableTime(
                        parseInt(item.split("m")[0]) * 60
                      )}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>10 images, 30 seconds</p>
                    <p>10 images, 30 seconds</p>
                    <p>10 images, 30 seconds</p>
                    <p>10 images, 30 seconds</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
