import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRecoilValue } from 'recoil';
import { files } from 'renderer/recoil/files/selectors';
import Controls from '../components/Controls';
import FooterControls from '../components/FooterControls';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

export default function Player() {
  const location = useLocation();
  const filesList = useRecoilValue(files);
  const [index, setIndex] = useState(location.state.index);
  const [status, setStatus] = useState(STATUS.STARTED);
  const [showFooter, setShowFooter] = useState(true);

  const nextImage = () => {
    if(index + 1 >= filesList.length ) return false;
    setIndex(index+1)
    return true;
  };

  const previousImage = () => {
    if(index - 1 < 0) return false;
    setIndex(index-1);
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
          key={index}
          in={index % 2 === 0}
          appear={true}
          timeout={800}
          classNames="fade"
        >
          <div className='flex justify-center'>
          <LazyLoadImage
      src={filesList[index]} 
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
