import { v4 as uuidv4 } from 'uuid';

export default function FolderUpload({ addFolder }) {
  const handleUpload = async () => {
    const folderPaths = await api.openDialog();
    if (!folderPaths) return;
    for (let i = 0; i < folderPaths.length; i++) {
      const folder = folderPaths[i];
      addFolder({
        name: folder.name,
        files: folder.files,
        id: uuidv4(),
        path: folder.path,
      });
    }
  };

  return (
    <button
      type="button"
      className="btn fill-secondary text-secondary"
      onClick={handleUpload}
    >
      <div className="flex justify-center">
        <svg className="mr-3 mt-[2] block h-6 w-6" viewBox="0 0 512 512">
          {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
          <path d="M105.4 182.6c12.5 12.49 32.76 12.5 45.25 .001L224 109.3V352c0 17.67 14.33 32 32 32c17.67 0 32-14.33 32-32V109.3l73.38 73.38c12.49 12.49 32.75 12.49 45.25-.001c12.49-12.49 12.49-32.75 0-45.25l-128-128C272.4 3.125 264.2 0 256 0S239.6 3.125 233.4 9.375L105.4 137.4C92.88 149.9 92.88 170.1 105.4 182.6zM480 352h-160c0 35.35-28.65 64-64 64s-64-28.65-64-64H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456z" />
        </svg>
        Add a folder
      </div>
    </button>
  );
}
