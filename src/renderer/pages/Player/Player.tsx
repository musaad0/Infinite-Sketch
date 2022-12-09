import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRecoilValue, useRecoilState } from 'recoil';
import { indexState } from 'renderer/globals/files/atoms';
import { files } from 'renderer/globals/files/selectors';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Controls from './Controls';
import FooterControls from './FooterControls';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

export default function Player() {
  const filesList = useRecoilValue(files);
  const [index, setIndex] = useRecoilState(indexState);
  const [status, setStatus] = useState(STATUS.STARTED);
  const [showFooter, setShowFooter] = useState(true);
  const [imageFlipH, setImageFlipH] = useState(false);
  const [imageFlipV, setImageFlipV] = useState(false);

  const nextImage = () => {
    if (index + 1 >= filesList.length) return false;
    setIndex(index + 1);
    return true;
  };

  const previousImage = () => {
    if (index - 1 < 0) return false;
    setIndex(index - 1);
    return true;
  };

  const handleStatus = (newStatus: string) => {
    setStatus(newStatus);
  };
  const handleShowFooter = () => {
    setShowFooter(!showFooter);
  };

  const handleImageFlipH = () => {
    setImageFlipH(!imageFlipH);
  };

  const handleImageFlipV = () => {
    setImageFlipV(!imageFlipV);
  };

  useEffect(() => {
    //  Prevent Scrolling on space Click
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === ' ') {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <TransitionGroup>
        <CSSTransition
          key={index}
          in={index % 2 === 0}
          appear
          timeout={800}
          classNames="fade"
        >
          <div className="flex justify-center">
            <LazyLoadImage
              src={filesList[index]}
              className={`mx-auto h-[calc(100vh_-_3.6rem)] max-w-full cursor-pointer object-contain ${
                showFooter ? '' : 'h-[calc(100vh_-_2rem)]'
              } ${imageFlipH ? '-scale-y-100' : ''} ${
                imageFlipV ? '-scale-x-100' : ''
              }`}
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
          showFooter={showFooter}
          handleImageFlipH={handleImageFlipH}
          handleImageFlipV={handleImageFlipV}
        />
      </div>
    </>
  );
}
