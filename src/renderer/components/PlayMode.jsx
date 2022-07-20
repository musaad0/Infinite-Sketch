import { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Interval from './Interval';
import PlayerContext from 'renderer/context/PlayerContext';

export default function PlayMode({
  filesTotal,
  addFolder,
  setStateFoldersList,
}) {
  const [index, setIndex] = useState({ folderIndex: 0, fileIndex: 0 });
  const { interval } = useContext(PlayerContext);
  const [stateInterval, setStateInterval] = interval;

  const loadSession = () => {
    // Later --> COMBINE ALL SAVED VARIABLES INTO ONE OBJECT

    const savedFolders = window.api.recieveFrom.get(); // second argument has no value

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
    setStateInterval(30);
    setIndex({ folderIndex: 0, fileIndex: 0 });
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
