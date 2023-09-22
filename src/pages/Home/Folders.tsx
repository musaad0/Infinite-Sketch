import { useAutoAnimate } from "@formkit/auto-animate/react";
import { open } from "@tauri-apps/api/dialog";
import { Trash2Icon, UploadCloudIcon } from "lucide-react";

import { Button, toast } from "@/components";

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
    toast.dismiss(loadingToast);

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
        <UploadCloudIcon className="ms-2 h-4 w-4" />
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
      <div className="mt-6">
        {/* Mimick a table because animating table causes issues with useAutoAnimate */}
        <dl
          ref={parent}
          className="divide-y divide-gray-200 dark:divide-muted-foreground"
        >
          {folders.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-2 text-sm"
            >
              <div className="flex w-72 items-center justify-between">
                <dt className="w-40 overflow-hidden truncate font-medium text-primary">
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
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 py-2 text-sm">
            <div className="flex w-72 items-center justify-between">
              <dt className="w-40 overflow-hidden truncate font-medium text-primary">
                Total
              </dt>
              <dd className="">
                {folders.reduce((sum, li) => sum + li.files.length, 0)}
              </dd>
            </div>
            <div className={"h-10 px-4 py-2"}>
              <div className="h-4 w-4" />
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
