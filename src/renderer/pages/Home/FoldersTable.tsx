import { useRecoilValue } from 'recoil';
import { initialIndexState } from 'renderer/globals/files/atoms';
import { Folder } from 'renderer/types';

interface Props {
  stateFoldersList: Folder[];
  filesTotal: number;
  handleRemove: (id: string) => void;
}

export default function FoldersTable({
  stateFoldersList,
  filesTotal,
  handleRemove,
}: Props) {
  const intialIndex = useRecoilValue(initialIndexState);
  return (
    <>
      {intialIndex > 0 && (
        <div className="text-center text-sm text-neutral-500">
          Note: removing a folder will reset your progress
          <br />
          (your saved session won&apos;t be affected)
        </div>
      )}
      <div className="relative overflow-x-auto rounded">
        <table className="w-full text-left text-lg text-neutral-400">
          <thead className="bg-neutral-700 text-lg uppercase text-neutral-400">
            <tr>
              <th scope="col" className="w-3/4 px-6 py-2.5">
                Folder
              </th>
              <th scope="col" className="mr-6 py-2.5 text-center">
                No.
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-400" id="tableFiles">
            {stateFoldersList.map((folder) => {
              return (
                <tr
                  className="border-neutral-600 transition-colors last:border-b hover:cursor-pointer hover:bg-neutral-600"
                  onClick={() => handleRemove(folder.id)}
                  key={folder.id}
                >
                  <th
                    scope="row"
                    className={`overflow-hidden text-ellipsis px-6 py-2.5 font-medium ${
                      folder.name.length < 25 ? 'break-words' : ''
                    } max-w-[80px]`}
                  >
                    {folder.name}
                  </th>
                  <td className="py-2.5 text-center">{folder.files.length}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="px-6 py-3.5 font-medium">
                Total
              </th>
              <td className="px-6 py-3.5 text-center">
                <span id="totalImages">{filesTotal}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
