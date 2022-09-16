/* eslint-disable import/prefer-default-export */
import { selector } from 'recoil';
import { interval } from './atoms';

export const intervalValue = selector({
  key: 'intervalValue',
  get: ({ get }) => {
    const intervalInput = get(interval);
    if (!intervalInput) return 30;
    const lastInputChar = intervalInput[intervalInput.length - 1].toLowerCase();
    if (typeof lastInputChar === 'string' && lastInputChar === 'm') {
      // convert minutes to seconds
      return parseInt(intervalInput, 10) * 60;
    }
    // seconds is default
    return parseInt(intervalInput, 10);
  },
});
