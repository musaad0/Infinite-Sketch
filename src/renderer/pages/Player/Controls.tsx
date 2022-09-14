import { useEffect, useState } from 'react';
import useInterval from 'renderer/hooks/useInterval';
import { useRecoilValue } from 'recoil';
import { intervalValue } from 'renderer/recoil/interval/selectors';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

interface Props {
  nextImage: () => boolean;
  status: string;
  setStatus: (status: string) => void;
  index: number;
}
export default function Controls({
  nextImage,
  status,
  setStatus,
  index,
}: Props) {
  const stateInterval = useRecoilValue(intervalValue);
  const [secondsRemaining, setSecondsRemaining] = useState(stateInterval);

  const handleStart = () => {
    setStatus(STATUS.STARTED);
  };
  const handleStop = () => {
    setStatus(STATUS.STOPPED);
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
  }, [index, stateInterval]);

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
