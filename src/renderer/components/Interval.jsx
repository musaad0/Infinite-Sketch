import { useState, useContext, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {interval} from '../recoil/interval/atoms'

const values = ['45S', '2M', '5M'];

export default function Interval() {
  const [intervalState,setIntervalState] = useRecoilState(interval)

  const setInputInterval = (e) => {
    setIntervalState(e.target.value);
  };

  return (
    <div className="interval">
      <span className="mb-2 block text-center text-secondary">Interval</span>
      <div className="flex w-full text-xl">
        {values.map((value, index) => (
          <button
            type="button"
            className="btn select-none rounded-none first:rounded-l"
            value={value}
            onClick={setInputInterval}
            key={index}
          >
            {value}
          </button>
        ))}
        <input
          className="block w-full rounded-r bg-neutral-50 p-2 text-center text-bgColor placeholder:text-xl focus:outline-none focus:ring-0 focus:placeholder:invisible"
          id="setTimer"
          type="text"
          placeholder="45s/2m"
          onChange={setInputInterval}
          value={intervalState}
        />
      </div>
    </div>
  );
}
