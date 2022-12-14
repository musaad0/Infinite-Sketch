/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';

interface Props {
  name: string;
  onChange: (value: string | number) => void;
  debounce?: number;
  initialValue: number | string;
  max: number;
  min: number;
  step: number;
}
export default function RangeSlider({
  initialValue,
  name,
  onChange,
  max,
  min,
  step,
  debounce = 500,
}: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <>
      <input
        id={name}
        type="range"
        value={value}
        max={max}
        min={min}
        step={step}
        onChange={(e) => setValue(e.target.value)}
        className="ml-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-400"
      />
    </>
  );
}
