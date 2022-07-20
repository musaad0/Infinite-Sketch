import { useState, useEffect, useContext } from 'react';
import PlayMode from 'renderer/components/PlayMode';
import FolderUpload from 'renderer/components/FolderUploads';
import FoldersTable from 'renderer/components/FoldersTable';
import PlayerContext from 'renderer/context/PlayerContext';

export default function Home() {
  // Unnecessary Home re-rendering update later
  const { foldersList } = useContext(PlayerContext);
  const [stateFoldersList, setStateFoldersList] = foldersList;
  const [filesTotal, setFilesTotal] = useState(0);

  const getTotalFiles = () => {
    // get total number of files of all folders
    setFilesTotal(() =>
      stateFoldersList.reduce((prev, { files }) => prev + files.length, 0)
    );
  };

  const addFolder = (folder) => {
    // push folder to list
    setStateFoldersList((arr) => [...arr, folder]);
  };

  const removeFolder = (id) => {
    const newList = stateFoldersList.filter((item) => item.id !== id);
    setStateFoldersList(newList);
  };

  // Remove Later
  useEffect(() => {
    getTotalFiles();
  }, [stateFoldersList]);

  return (
    <div className="startPage mx-auto mt-14 flex max-w-md flex-col gap-3 px-6 text-2xl">
      <FolderUpload addFolder={addFolder} />

      <FoldersTable
        handleRemove={removeFolder}
        stateFoldersList={stateFoldersList}
        filesTotal={filesTotal}
      />

      <PlayMode
        filesTotal={filesTotal}
        addFolder={addFolder}
        setStateFoldersList={setStateFoldersList}
      />
    </div>
  );
}
