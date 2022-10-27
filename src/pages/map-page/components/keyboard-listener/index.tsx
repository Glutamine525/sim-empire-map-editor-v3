import { OperationType } from '@/map-core/type';
import { changeBrush, changeOperation } from '@/store/reducers/map-reducer';
import { getRoadBuilding } from '@/utils/building';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const KeyboardListener = () => {
  const d = useDispatch();

  useEffect(() => {
    const disableSpaceScroll = (e: KeyboardEvent) => {
      if (e.code !== 'Space') {
        return;
      }
      e.preventDefault();
    };

    const listener = (e: KeyboardEvent) => {
      const { code } = e;
      console.log(code);

      switch (code) {
        case 'Space':
          d(changeOperation(OperationType.Empty));
          break;
        case 'KeyA':
          d(changeOperation(OperationType.PlaceBuilding));
          d(changeBrush(getRoadBuilding()));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', disableSpaceScroll, true);
    window.addEventListener('keyup', listener, true);

    return () => {
      window.removeEventListener('keydown', disableSpaceScroll, true);
      window.removeEventListener('keyup', listener);
    };
  }, []);

  return null;
};

export default memo(KeyboardListener);
