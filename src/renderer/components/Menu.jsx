import { useEffect, useState } from 'react';
import useContextMenu from '../hooks/useContextMenu';

function MenuButton({name,shortcut,handleClick,showMark}){
    return (
          <button
            aria-current="true"
            type="button"
            className="border-neutral-200 w-full relative cursor-pointer rounded-t px-8 py-2 hover:text-secondary/75 hover:fill-secondary/75 transition-colors"
            onClick={handleClick}
          >
            <div className="flex justify-between">
                <span className='flex'>
                    {showMark?
                    <svg className="absolute left-3 top-2.5 w-3" viewBox="0 0 448 512">
                        {/* <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                        <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>
                        :
                        null
                    }
                    {name}
                </span>
                <span>{shortcut}</span>
            </div>
          </button>
    )
}

export default function Menu(){
  const { anchorPoint, show,windowCheck } = useContextMenu();
  const [alwaysOnTop,setAlwaysOnTop] = useState(true);
  
  const handleAlwaysOnTop = () => {
    setAlwaysOnTop(!alwaysOnTop);
  }
    useEffect(() => {
    function handleKeyUp(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        handleAlwaysOnTop();
      }
    }
    document.addEventListener('keydown', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyUp);
    };
  });

  useEffect(()=>{
    const alwaysOnTopToggle =  api.store.get('alwaysOnTopToggle');
    if(typeof alwaysOnTop !== "undefined") setAlwaysOnTop(alwaysOnTopToggle);
  },[]);

  useEffect(()=>{
    api.send('contextMenu:alwaysOnTop',alwaysOnTop);
  },[alwaysOnTop]);

  if (show) {
    return (
      <div
        className={`flex sub-left justify-center absolute bg-[#202020] rounded text-secondary/50 text-sm border border-neutral-900 fill-secondary/50 ${windowCheck? '-left-full right-0': ''}`}
        style={{ top: anchorPoint.y, left: anchorPoint.x }}
      >
        <div className="w-72 rounded-lg">
            <MenuButton name="Always On Top" shortcut="Ctrl+Shift+A" handleClick={handleAlwaysOnTop} showMark={alwaysOnTop}/>
        </div>
      </div>
    );
  }
  return <></>;
};

