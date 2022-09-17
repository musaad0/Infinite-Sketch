import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { interval } from 'renderer/globals/interval/atoms';
import {
  shuffleState,
  indexState,
  initialIndexState,
} from 'renderer/globals/files/atoms';
import { Folder, Shuffle } from '../../types';
import Interval from './Interval';

interface Props {
  filesTotal: number;
  addFolder: (folder: Folder) => void;
  setStateFoldersList: any;
}

const getRandom = () => {
  return Math.floor(Math.random() * 10000 + 1);
};

export default function PlayMode({
  filesTotal,
  addFolder,
  setStateFoldersList,
}: Props) {
  const setStateInterval = useSetRecoilState(interval);
  const setIndex = useSetRecoilState(indexState);
  const [initialIndex, setInitialIndex] = useRecoilState(initialIndexState);
  const [shuffle, setShuffle] = useRecoilState<Shuffle>(shuffleState);
  const [loadSessionDisabled, setLoadSessionDisabled] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadSession = async () => {
    const savedFolders = await window.api.getFolders();
    if (typeof savedFolders !== 'undefined') {
      for (const file of savedFolders) {
        addFolder({
          name: file.name,
          files: file.files,
          id: uuidv4(),
          path: file.path,
        });
      }
    }
    const session = window.api.store.get('session');
    if (typeof session !== 'undefined') {
      setIndex(session.index || 0);
      setInitialIndex(session.index || 0);
      setStateInterval(session.interval || '30s');
      setShuffle(session.shuffle || { isShuffle: false, seed: getRandom() });
    }
    setLoadSessionDisabled(true);
  };

  const handleReset = () => {
    setStateFoldersList([]);
    setStateInterval('');
    setIndex(0);
    setInitialIndex(0);
    setLoadSessionDisabled(false);
  };

  const handleShuffle = () => {
    if (!shuffle.isShuffle) {
      setIndex(0);
      setInitialIndex(0);
    }
    setShuffle(() => ({ isShuffle: !shuffle.isShuffle, seed: getRandom() }));
  };

  useEffect(() => {
    if (filesTotal === 0 || initialIndex === 0) setProgress(0);
    else {
      setProgress(() => {
        return Math.floor(((initialIndex + 1) / filesTotal) * 100);
      });
    }
  }, [initialIndex, filesTotal]);

  return (
    <div className="flex select-none flex-col gap-4">
      <Interval />
      <div className="flex gap-2">
        <Link to="/player" tabIndex={-1} draggable={false} className="w-full">
          <button
            type="button"
            disabled={!(filesTotal > 0)}
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
          type="button"
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
          disabled={filesTotal > 0 || loadSessionDisabled}
          className="btn disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70"
          onClick={loadSession}
        >
          Load Session
        </button>
        <button
          className="btn disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70"
          onClick={handleReset}
          type="button"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col items-center text-lg text-secondary/80">
        <div className="mb-1 h-1.5 w-full rounded-full bg-neutral-700">
          <div
            className="h-1.5 rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{progress} %</span>
      </div>
    </div>
  );
}
