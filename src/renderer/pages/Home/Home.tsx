import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { folders, initialIndexState } from 'renderer/globals/files/atoms';
import { Folder } from 'renderer/types';
import { foldersTotal } from 'renderer/globals/files/selectors';
import PlayMode from 'renderer/pages/Home/PlayMode';
import FolderUpload from 'renderer/pages/Home/FolderUploads';
import FoldersTable from 'renderer/pages/Home/FoldersTable';

export default function Home() {
  const [stateFoldersList, setStateFoldersList] =
    useRecoilState<Folder[]>(folders);
  const setInitialIndex = useSetRecoilState(initialIndexState);

  const filesTotal = useRecoilValue(foldersTotal);

  const addFolder = (folder: Folder) => {
    // push folder to list
    setStateFoldersList((arr) => [...arr, folder]);
  };

  const removeFolder = (id: string) => {
    const newList = stateFoldersList.filter((item) => item.id !== id);
    setInitialIndex(0);
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
