import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { folders, shuffleState } from 'renderer/recoil/files/atoms';
import { interval } from 'renderer/recoil/interval/atoms';
import { indexState, initialIndexState } from 'renderer/recoil/files/atoms';

export default function EndModal({ showModal, handleShowModal }) {
  const foldersList = useRecoilValue(folders);
  const stateInterval = useRecoilValue(interval);
  const shuffle = useRecoilValue(shuffleState);
  const [initialIndex, setInitialIndex] = useRecoilState(initialIndexState);
  const [index, setIndex] = useRecoilState(indexState);

  const handleSave = () => {
    setInitialIndex(index);
    const foldersPaths = foldersList.map((folder) => {
      let path = '';
      const folderName = folder.name;
      const fullPath = folder.files[0].split('\\');
      for (const fName of fullPath) {
        path += fName;
        if (fName === folderName) break;
        path += '\\';
      }
      return path;
    });
    api.store.set('foldersPaths', foldersPaths);
    api.store.set('interval', stateInterval);
    api.store.set('index', index);
    api.store.set('shuffle', shuffle);
  };

  const handleSavedIndex = () => {
    setIndex(initialIndex);
  };

  return (
    <div className={`${showModal ? '' : 'hidden'} text-xl`}>
      <div
        className="modalBackground fixed top-0 left-0 right-0 bottom-0 bg-[#000000]/40"
        onClick={handleShowModal}
      />
      <div className="fixed top-1/2 left-1/2 w-11/12 max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-800 py-5 px-6 text-center shadow-xl">
        <div className="text-2xl text-neutral-300">Save & Quit ?</div>
        <div className="mt-4 flex justify-center gap-4 fill-secondary text-secondary">
          <Link
            to={'/'}
            tabIndex={-1}
            draggable={false}
            className="block w-full rounded-lg bg-primary px-6 py-2 transition-colors hover:bg-primary-dark"
            onClick={handleSave}
          >
            Yes
          </Link>
          <button
            className="block w-full rounded-lg bg-neutral-600 px-6 py-2 text-neutral-300/95 transition-colors hover:bg-neutral-700"
            onClick={handleShowModal}
          >
            Cancel
          </button>
          <Link
            to={'/'}
            tabIndex={-1}
            draggable={false}
            onClick={handleSavedIndex}
            className="flex rounded-lg bg-primary !px-6 !py-2 transition-colors hover:bg-primary-dark "
          >
            <svg className="mx-auto w-[23px]" viewBox="0 0 576 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
              <path d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
