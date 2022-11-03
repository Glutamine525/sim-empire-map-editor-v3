import { MapCore } from '@/map-core';
import { BuildingType, CivilBuilding } from '@/map-core/building';
import { OperationType } from '@/map-core/type';
import { changeBrush, changeOperation } from '@/store/reducers/map-reducer';
import { getGeneralBuilding, getRoadBuilding, getSelectedBuilding } from '@/utils/building';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const KeyboardListener = () => {
  const d = useDispatch();

  useEffect(() => {
    const preventDefault = (e: KeyboardEvent) => {
      const { code } = e;
      if (code === 'Space' || /^F[\d]{1,2}$/.test(code)) {
        e.preventDefault();
      }
    };

    const dispatchProtectionBuilding = (index: number) => {
      const { protection, civil } = MapCore.getInstance();
      if (protection.length < index + 1) {
        return;
      }
      d(changeOperation(OperationType.PlaceBuilding));
      d(
        changeBrush(
          getSelectedBuilding(
            civil,
            BuildingType.Municipal,
            CivilBuilding[civil][BuildingType.Municipal].find((v) => v.name === protection[index])!,
          ),
        ),
      );
    };

    const dispatchBuilding = (type: BuildingType, key: string | number) => {
      const { civil } = MapCore.getInstance();
      d(changeOperation(OperationType.PlaceBuilding));
      d(
        changeBrush(
          getSelectedBuilding(
            civil,
            type,
            typeof key === 'number'
              ? CivilBuilding[civil][type][key]
              : CivilBuilding[civil][type].find((v) => v.name === key)!,
          ),
        ),
      );
    };

    const listener = (e: KeyboardEvent) => {
      const { code } = e;
      console.log(code);
      if (/^F[\d]{1,2}$/.test(code)) {
        // F1-F12 商业建筑
        const { civil } = MapCore.getInstance();
        const idx = Number(code.substring(1)) - 1;
        if (idx >= CivilBuilding[civil][BuildingType.Commerce].length) {
          return;
        }
        dispatchBuilding(BuildingType.Commerce, idx);
        return;
      }
      switch (code) {
        case 'Space':
          d(changeOperation(OperationType.Empty));
          break;
        case 'KeyA':
          d(changeOperation(OperationType.PlaceBuilding));
          d(changeBrush(getRoadBuilding()));
          break;
        case 'KeyZ':
          dispatchProtectionBuilding(0);
          break;
        case 'KeyX':
          dispatchProtectionBuilding(1);
          break;
        case 'KeyC':
          dispatchProtectionBuilding(2);
          break;
        case 'KeyV':
          dispatchProtectionBuilding(3);
          break;
        case 'KeyQ':
          d(changeOperation(OperationType.PlaceBuilding));
          d(changeBrush(getGeneralBuilding(2)));
          break;
        case 'KeyW':
          d(changeOperation(OperationType.PlaceBuilding));
          d(changeBrush(getGeneralBuilding(3)));
          break;
        case 'KeyE':
          d(changeOperation(OperationType.PlaceBuilding));
          d(changeBrush(getGeneralBuilding(4)));
          break;
        case 'KeyR':
          d(changeOperation(OperationType.PlaceBuilding));
          d(changeBrush(getGeneralBuilding(5)));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', preventDefault, true);
    window.addEventListener('keyup', listener, true);

    return () => {
      window.removeEventListener('keydown', preventDefault, true);
      window.removeEventListener('keyup', listener);
    };
  }, []);

  return null;
};

export default memo(KeyboardListener);
