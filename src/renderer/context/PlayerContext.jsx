import { createContext, useState } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [interval, setInterval] = useState(30);
  const [foldersList, setFoldersList] = useState([]);
  return (
    <PlayerContext.Provider
      value={{
        interval: [interval, setInterval],
        foldersList: [foldersList, setFoldersList],
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export default PlayerContext;
