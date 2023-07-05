import { open } from "@tauri-apps/api/dialog";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Button, toast } from "@/components";
import { Trash2Icon, UploadCloudIcon } from "lucide-react";
import { useFoldersStore } from "@/store/foldersStore";
import { getFilesRecursively } from "@/apis/files";

type Props = {};

const addFolder = useFoldersStore.getState().addFolder;

async function openFileDialog() {
  const selected = await open({
    directory: true,
    recursive: true,
    multiple: true,
    // to bypass a bug on tauri that allows files to be uploaded
    filters: [
      {
        name: "fileBug",
        extensions: [],
      },
    ],
  });
  if (Array.isArray(selected)) {
    // user selected multiple files
    const loadingToast = toast.loading("Adding Files... ");
    const folders = await getFilesRecursively(selected);
    folders?.forEach((item) => {
      addFolder(item);
    });
    toast.success("Added Files Successfully", {
      id: loadingToast,
    });
    // return folders;
  } else if (selected === null) {
    // user cancelled the selection
  } else {
    // user selected a single file
    // user woudn't/shouldn't be able to do that
  }
}

export default function Folders({}: Props) {
  return (
    <>
      <Button
        className="w-full"
        onClick={async () => {
          await openFileDialog();
        }}
      >
        Upload File
        <UploadCloudIcon className="w-4 h-4 ms-2" />
      </Button>
      <FoldersTable />
    </>
  );
}

function FoldersTable() {
  const folders = useFoldersStore((state) => state.folders);
  const deleteFolder = useFoldersStore((state) => state.deleteFolder);
  const [parent] = useAutoAnimate();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-6 border-t border-gray-100">
        {/* Mimick a table because animating table causes issues with useAutoAnimate */}
        <dl ref={parent} className="divide-y divide-gray-100">
          {folders.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 gap-4 text-sm"
            >
              <div className="flex justify-between w-72 items-center">
                <dt className="font-medium text-primary truncate overflow-hidden w-40">
                  {item.name}
                </dt>
                <dd className="">{item.files.length}</dd>
              </div>
              <Button
                variant={"ghost"}
                onClick={() => {
                  deleteFolder(item.id);
                }}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 gap-4 text-sm">
            <div className="flex justify-between w-72 items-center">
              <dt className="font-medium text-primary truncate overflow-hidden w-40">
                Total
              </dt>
              <dd className="">
                {folders.reduce((sum, li) => sum + li.files.length, 0)}
              </dd>
            </div>
            <div className={"h-10 px-4 py-2"}>
              <div className="w-4 h-4" />
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
