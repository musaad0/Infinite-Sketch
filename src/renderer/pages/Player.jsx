import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PlayerContext from 'renderer/context/PlayerContext';
import Controls from '../components/Controls';
import FooterControls from '../components/FooterControls';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

export default function Player() {
  const location = useLocation();
  const { foldersList } = useContext(PlayerContext);
  const [stateFoldersList, stateSetFoldersList] = foldersList;
  const [index, setIndex] = useState({
    fileIndex: location.state.index.fileIndex,
    folderIndex: location.state.index.folderIndex,
  });
  const [status, setStatus] = useState(STATUS.STARTED);
  const [showFooter, setShowFooter] = useState(true);

  const nextImage = () => {
    let tempIndex = index.folderIndex;
    const foldersLength = stateFoldersList.length;
    const filesLength = stateFoldersList[tempIndex].files.length;
    if (
      index.folderIndex + 1 >= foldersLength &&
      index.fileIndex + 1 >= filesLength
    ) {
      return false;
    }
    if (index.fileIndex + 1 >= filesLength) {
      tempIndex += 1;
    }

    setIndex({
      folderIndex: tempIndex,
      fileIndex: (index.fileIndex + 1) % filesLength,
    });
    return true;
  };

  const previousImage = () => {
    let tempFolderIndex = index.folderIndex;
    let tempFileIndex = index.fileIndex;

    if (tempFileIndex === 0 && tempFolderIndex === 0) return false;

    tempFileIndex -= 1;
    if (tempFolderIndex !== 0 && index.fileIndex === 0) {
      tempFolderIndex -= 1;
      tempFileIndex = stateFoldersList[tempFolderIndex].files.length;
    }

    setIndex({ folderIndex: tempFolderIndex, fileIndex: tempFileIndex });
    return true;
  };

  const handleStatus = (newStatus) => {
    setStatus(newStatus);
  };
  const handleShowFooter = () => {
    setShowFooter(!showFooter);
  };

  useEffect(() => {
    //  Prevent Scrolling on space Click
    function handleKeyDown(e) {
      if (e.key === ' ') {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <>
      <TransitionGroup>
        <CSSTransition
          key={index.fileIndex}
          in={(index.fileIndex) % 2 === 0}
          appear={true}
          timeout={800}
          classNames="fade"
        >
          <div className='flex justify-center'>
          <LazyLoadImage
      src={stateFoldersList[index.folderIndex].files[index.fileIndex]} 
      className= {`mx-auto h-[calc(100vh_-_3.6rem)] max-w-full cursor-pointer object-contain ${showFooter ? '' : 'h-[calc(100vh_-_2rem)]'}`}
      effect="blur"
      onClick={handleShowFooter}
      />
          </div>
        </CSSTransition>
      </TransitionGroup>
      <div className="fixed bottom-0 flex w-full flex-col bg-neutral-900 text-sm ">
        <Controls
          nextImage={nextImage}
          status={status}
          setStatus={handleStatus}
          index={index}
        />

        <FooterControls
          nextImage={nextImage}
          previousImage={previousImage}
          status={status}
          handleStatus={handleStatus}
          handleReset={handleStatus}
          showFooter={showFooter}
          handleShowFooter={handleShowFooter}
          index={index}
        />
      </div>
    </>
  );
}
