import { Input } from "@/components";
import { Timer, usePlayerStore } from "@/store/playerStore";
import React, { useEffect, useState } from "react";

type Props = {};

export function IntervalPicker() {
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
