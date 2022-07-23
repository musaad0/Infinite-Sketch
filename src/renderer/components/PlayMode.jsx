import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { interval } from 'renderer/recoil/interval/atoms';
import Interval from './Interval';

export default function PlayMode({
  filesTotal,
  addFolder,
  setStateFoldersList,
}) {
  const [index, setIndex] = useState(0);
  const [stateInterval, setStateInterval] = useRecoilState(interval);

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
  };
  const handleReset = () => {
    setStateFoldersList([]);
    setStateInterval('');
    setIndex(0);
  };

  return (
    <div className="flex select-none flex-col gap-4">
      <Interval />
      <Link to="/player" tabIndex={-1} draggable={false} state={{ index }}>
        <button
          type="button"
          disabled={filesTotal > 0 ? false : true}
          draggable={false}
          className="btn disabled:cursor-default disabled:bg-primary/30 disabled:text-secondary/70"
        >
          Start
        </button>
      </Link>

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
