import React from 'react';

export default function FooterControlsButton({ children, handleClick }) {
  return (
    <button
      type="button"
      className="block w-full items-center p-1.5 outline-none hover:cursor-pointer hover:bg-neutral-700 hover:fill-neutral-400 hover:text-neutral-400 hover:stroke-neutral-400"
      onClick={handleClick}
      tabIndex={-1}
    >
      <span className="flex items-center justify-center">{children}</span>
    </button>
  );
}
