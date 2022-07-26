import { useState, useEffect } from 'react';
import FooterControlsButton from './FooterControlsButton';
import EndModal from './EndModal';

const svgClass = 'block w-3.5 h-3.5';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

export default function FooterControls({
  handleStatus,
  status,
  handleReset,
  nextImage,
  previousImage,
  showFooter,
  handleShowFooter,
  index,
  handleImageFlipH,
  handleImageFlipV,
}) {
  const [showModal, setShowModal] = useState(false);

  const handleNext = () => {
    if (nextImage()) {
      return;
    }
    // Code...
  };

  const handlePrevious = () => {
    if (previousImage()) {
      return;
    }
    // Code...
  };
  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    function handleKeyUp(e) {
      if (e.key === 'ArrowRight') {
        handleNext();
      }
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
      if (e.key === ' ') {
        if (STATUS.STARTED === status) handleStatus(STATUS.STOPPED);
        else handleStatus(STATUS.STARTED);
      }

      if (e.key === 'Escape') {
        setShowModal(!showModal);
      }
    }
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  return (
    <>
      <div
        className={`flex select-none fill-neutral-500 text-sm text-neutral-500 ${
          showFooter ? '' : 'hidden'
        }`}
      >
        <FooterControlsButton handleClick={handlePrevious}>
          <svg className={svgClass} viewBox="0 0 512 512">
            {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path d="M459.5 71.41l-171.5 142.9v83.45l171.5 142.9C480.1 457.7 512 443.3 512 415.1V96.03C512 68.66 480.1 54.28 459.5 71.41zM203.5 71.41L11.44 231.4c-15.25 12.87-15.25 36.37 0 49.24l192 159.1c20.63 17.12 52.51 2.749 52.51-24.62v-319.9C255.1 68.66 224.1 54.28 203.5 71.41z" />
          </svg>
        </FooterControlsButton>

        {status === STATUS.STARTED ? (
          <FooterControlsButton
            handleClick={() => handleStatus(STATUS.STOPPED)}
          >
            <svg className={svgClass} viewBox="0 0 320 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
              <path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z" />
            </svg>
          </FooterControlsButton>
        ) : (
          <FooterControlsButton
            handleClick={() => handleStatus(STATUS.STARTED)}
          >
            <svg className={svgClass} viewBox="0 0 384 512">
              {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
              <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
            </svg>
          </FooterControlsButton>
        )}

        <FooterControlsButton handleClick={handleNext}>
          <svg className={svgClass} viewBox="0 0 512 512">
            {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path d="M52.51 440.6l171.5-142.9V214.3L52.51 71.41C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6zM308.5 440.6l192-159.1c15.25-12.87 15.25-36.37 0-49.24l-192-159.1c-20.63-17.12-52.51-2.749-52.51 24.62v319.9C256 443.3 287.9 457.7 308.5 440.6z" />
          </svg>
        </FooterControlsButton>

        <FooterControlsButton handleClick={() => setShowModal(true)}>
          <svg className={svgClass} viewBox="0 0 384 512">
            {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path d="M384 128v255.1c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V128c0-35.35 28.65-64 64-64H320C355.3 64 384 92.65 384 128z" />
          </svg>
        </FooterControlsButton>

        <FooterControlsButton handleClick={handleShowFooter}>
          <svg className={svgClass} viewBox="0 0 448 512">
            {/* <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
            <path d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z" />
          </svg>
        </FooterControlsButton>

        <FooterControlsButton handleClick={handleImageFlipV}>
          <svg
            className="stroke-neutral-500"
            width="18"
            height="18"
            viewBox="0 0 355 260"
            fill="none"
          >
            <path
              d="M16 244L16 16L150 130L16 244Z"
              stroke-width="32"
              stroke-linejoin="round"
            />
            <path
              className="fill-neutral-500 stroke-neutral-500"
              d="M339 244L339 16L205 130L339 244Z"
              fill="black"
              stroke="black"
              stroke-width="32"
              stroke-linejoin="round"
            />
          </svg>
        </FooterControlsButton>

        <FooterControlsButton handleClick={handleImageFlipH}>
          <svg
            className="rotate-90 stroke-neutral-500"
            width="18"
            height="18"
            viewBox="0 0 355 260"
            fill="none"
          >
            <path
              d="M16 244L16 16L150 130L16 244Z"
              stroke-width="32"
              stroke-linejoin="round"
            />
            <path
              className="fill-neutral-500 stroke-neutral-500"
              d="M339 244L339 16L205 130L339 244Z"
              fill="black"
              stroke="black"
              stroke-width="32"
              stroke-linejoin="round"
            />
          </svg>
        </FooterControlsButton>
      </div>

      <EndModal
        showModal={showModal}
        handleShowModal={handleShowModal}
        index={index}
      />
    </>
  );
}
