import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { CLASS_MODES, CLASS_MODE_OPTIONS } from "@/constants";
import { Timer } from "@/models";
import { PlayMode, usePlayerStore, shallow } from "@/store";
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
          className="my-5 grid w-full grid-cols-3"
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
        <TabsContent className="space-y-4" value={tabs.quantity}>
          <IntervalPicker />
          <QuantityMode />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuantityMode() {
  const [imagesToDraw, setImagesToDraw] = usePlayerStore(
    (state) => [state.imagesToDraw, state.setImagesToDraw],
    shallow,
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex gap-1">
          {([10, 20, 30, 40] as const).map((item) => (
            <Button
              type="button"
              key={item}
              variant="outline"
              onClick={() => {
                setImagesToDraw(item);
              }}
            >
              {item}
            </Button>
          ))}
          <Input
            aria-label="images to draw"
            value={imagesToDraw}
            onChange={(e) => {
              const val = e.currentTarget.value;
              if (val) setImagesToDraw(parseInt(val));
            }}
            defaultValue={10}
            type="number"
            id="images_to_draw"
          />
        </div>
      </div>
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
      <span className="flex gap-1">
        {(["30s", "45s", "2m", "5m"] as const).map((item) => (
          <Button
            type="button"
            key={item}
            variant="outline"
            onClick={() => {
              setInputValue(item);
            }}
          >
            {item}
          </Button>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
      </span>
    </div>
  );
}

function ClassMode() {
  const setClassModeLength = usePlayerStore(
    (state) => state.setClassModeLength,
  );
  return (
    <div>
      <Select
        defaultValue={CLASS_MODE_OPTIONS[0]}
        onValueChange={setClassModeLength}
      >
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
                        parseInt(item.split("m")[0]) * 60,
                      )}
                    </SelectItem>
                  </TooltipTrigger>
                  <TooltipContent className="w-64" side="top">
                    {CLASS_MODES[item].map((item) => (
                      <div>
                        <p>
                          {item.imagesToPlay}{" "}
                          {item.imagesToPlay > 1 ? "images" : "image"},{" "}
                          {item.timer.includes("s")
                            ? `${item.timer.split("s")[0]} seconds`
                            : `${item.timer.split("m")[0]} minutes`}
                          {item.break?.breakBetweenEachImageTime ? (
                            <>, break {item.break.breakBetweenEachImageTime}</>
                          ) : (
                            ""
                          )}
                        </p>
                        {item.break?.breakAfterSectionEndsTime ? (
                          <p>{item.break.breakAfterSectionEndsTime} break</p>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
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
