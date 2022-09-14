import { useEffect, useCallback, useState } from 'react';

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: '0', y: '0' });
  const [show, setShow] = useState(false);
  const [windowCheck, setWindowCheck] = useState(false);

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const contextMenuWidth = 288;
      const contextSubMenuWidth = 288;
      let leftPos = '';
      if (e.pageX < window.innerWidth - contextMenuWidth) {
        leftPos = `${e.pageX}px`;
      } else {
        leftPos = `${e.pageX - contextMenuWidth}px`;
      }
      if (
        e.pageX <
        window.innerWidth - contextMenuWidth - contextSubMenuWidth
      ) {
        setWindowCheck(false);
      } else {
        setWindowCheck(true);
      }

      setAnchorPoint({ x: leftPos, y: `${e.pageY}px` });
      setShow(!show);
    },
    [show]
  );

  const handleClick = useCallback(() => (show ? setShow(false) : null), [show]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });
  return { anchorPoint, show, windowCheck };
};

export default useContextMenu;
