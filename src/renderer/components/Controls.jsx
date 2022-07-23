import { useEffect, useState, useContext } from 'react';
import useInterval from 'renderer/hooks/useInterval';
import { useRecoilValue } from 'recoil';
import { intervalValue } from 'renderer/recoil/interval/selectors';
import PlayerContext from 'renderer/context/PlayerContext';
import FooterControls from './FooterControls';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

export default function Controls({ nextImage, status, setStatus, index }) {
  const stateInterval = useRecoilValue(intervalValue);
  const [secondsRemaining, setSecondsRemaining] = useState(stateInterval);

  const handleStart = () => {
    setStatus(STATUS.STARTED);
  };
  const handleStop = () => {
    setStatus(STATUS.STOPPED);
  };
  const handleReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(stateInterval);
  };
  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        if (nextImage()) {
          handleStop();
          handleStart();
          return;
        }
        handleStop();
      }
    },
    // passing null stops the interval
    status === STATUS.STARTED ? 1000 : null
  );
  useEffect(() => {
    setSecondsRemaining(stateInterval);
  }, [index]);

  return (
    <>
      {/* Add option option to display timer later */}
      {/* <div className='absolute  left-5 text-3xl'>{secondsRemaining}</div> */}
      <progress
        className="m-0 h-2 w-full p-0 "
        value={stateInterval - secondsRemaining}
        max={stateInterval}
      />
    </>
  );
}
