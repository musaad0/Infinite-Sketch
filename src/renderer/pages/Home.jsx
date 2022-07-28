import { useState, useEffect, useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { folders } from 'renderer/recoil/files/atoms';
import { foldersTotal } from 'renderer/recoil/files/selectors';
import PlayMode from 'renderer/components/PlayMode';
import FolderUpload from 'renderer/components/FolderUploads';
import FoldersTable from 'renderer/components/FoldersTable';

export default function Home() {
  const [stateFoldersList, setStateFoldersList] = useRecoilState(folders);
  const filesTotal = useRecoilValue(foldersTotal);

  const addFolder = (folder) => {
    // push folder to list
    setStateFoldersList((arr) => [...arr, folder]);
  };

  const removeFolder = (id) => {
    const newList = stateFoldersList.filter((item) => item.id !== id);
    setStateFoldersList(newList);
  };

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
