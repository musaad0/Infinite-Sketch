import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { interval } from 'renderer/recoil/interval/atoms';
import { shuffleState } from 'renderer/recoil/files/atoms';
import Interval from './Interval';

export default function PlayMode({
  filesTotal,
  addFolder,
  setStateFoldersList,
}) {
  const [index, setIndex] = useState(0);
  const [stateInterval, setStateInterval] = useRecoilState(interval);
  const [shuffle, setShuffle] = useRecoilState(shuffleState);

  const loadSession = () => {
    // Later --> COMBINE ALL SAVED VARIABLES INTO ONE OBJECT

    const savedFolders = window.api.recieveFrom.get();

    if (typeof savedFolders !== 'undefined') {
      for (const file of savedFolders) {
        addFolder({ name: file.name, files: file.files, id: uuidv4() });
      }
    }

    const savedIndex = api.store.get('index');

    if (typeof savedIndex !== 'undefined') {
      setIndex(savedIndex);
    }

    const savedInterval = api.store.get('interval');

    if (typeof savedInterval !== 'undefined') {
      setStateInterval(savedInterval);
    }

    const savedShuffle = api.store.get('shuffle');

    if (typeof savedShuffle !== 'undefined') {
      setShuffle(savedShuffle);
    }
  };
  const handleReset = () => {
    setStateFoldersList([]);
    setStateInterval('');
    setIndex(0);
  };
  const handleShuffle = () => {
    setShuffle((obj) => ({ isShuffle: !shuffle.isShuffle, seed: getRandom() }));
  };

  return (
    <div className="flex select-none flex-col gap-4">
      <Interval />
      <div className="flex gap-2">
        <Link
          to="/player"
          tabIndex={-1}
          draggable={false}
          state={{ index }}
          className="w-full"
        >
          <button
            type="button"
            disabled={filesTotal > 0 ? false : true}
            draggable={false}
            className="btn disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70"
          >
            Start
          </button>
        </Link>
        <button
          className={`btn w-14 fill-secondary hover:fill-secondary ${
            shuffle.isShuffle
              ? ''
              : 'bg-primary/30 fill-secondary/70 hover:bg-primary/50'
          }`}
          onClick={handleShuffle}
        >
          <svg
            className="mx-auto h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            {/* <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path d="M424.1 287c-15.13-15.12-40.1-4.426-40.1 16.97V352H336L153.6 108.8C147.6 100.8 138.1 96 128 96H32C14.31 96 0 110.3 0 128s14.31 32 32 32h80l182.4 243.2C300.4 411.3 309.9 416 320 416h63.97v47.94c0 21.39 25.86 32.12 40.99 17l79.1-79.98c9.387-9.387 9.387-24.59 0-33.97L424.1 287zM336 160h47.97v48.03c0 21.39 25.87 32.09 40.1 16.97l79.1-79.98c9.387-9.391 9.385-24.59-.0013-33.97l-79.1-79.98c-15.13-15.12-40.99-4.391-40.99 17V96H320c-10.06 0-19.56 4.75-25.59 12.81L254 162.7L293.1 216L336 160zM112 352H32c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c10.06 0 19.56-4.75 25.59-12.81l40.4-53.87L154 296L112 352z" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={filesTotal > 0}
          className="btn disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70"
          onClick={loadSession}
        >
          Load Session
        </button>
        <button
          className="btn disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function getRandom() {
  return Math.floor(Math.random() * 10000 + 1);
}
