import { useState, useContext, useEffect } from 'react';
import PlayerContext from 'renderer/context/PlayerContext';

const values = ['45S', '2M', '5M'];

export default function Interval() {
  // Later -> make one interval state
  const [intervalInput, setIntervalInput] = useState('');
  const { interval } = useContext(PlayerContext);
  const [stateInterval, setStateInterval] = interval;

  // convert interval to seconds
  const setInterval = () => {
    if (!intervalInput) return;
    if (intervalInput[intervalInput.length - 1].toLowerCase() === 'm') {
      // convert minutes to seconds
      setStateInterval(parseInt(intervalInput) * 60);
      return;
    }
    // seconds is default
    setStateInterval(parseInt(intervalInput));
  };
  useEffect(() => {
    setInterval();
  }, [intervalInput]);

  const setInputInterval = (e) => {
    setIntervalInput(e.target.value);
  };

  return (
    <div className="interval">
      <span className="mb-2 block text-center text-secondary">Interval</span>
      {/* <span className="text-center text-secondary">Interval</span> */}
      <div className="flex w-full text-xl">
        {values.map((value, index) => (
          <button
            type="button"
            className="btn select-none rounded-none first:rounded-l"
            value={value}
            onClick={setInputInterval}
            key={index}
          >
            {value}
          </button>
        ))}
        <input
          className="block w-full rounded-r bg-neutral-50 p-2 text-center text-bgColor placeholder:text-xl focus:outline-none focus:ring-0 focus:placeholder:invisible"
          id="setTimer"
          type="text"
          placeholder="45s/2m"
          onChange={setInputInterval}
          value={intervalInput}
        />
      </div>
    </div>
  );
}
