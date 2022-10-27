import React, { FC, memo, useMemo, useState } from 'react';
import { Layer } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import { MapCore } from '@/map-core';
import { isAllInRange, parseBuildingKey } from '@/utils/coord';
import { canHover } from '@/utils/building';
import { useDispatch, useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';
import { OperationType } from '@/map-core/type';
import { triggerMapUpdater } from '@/store/reducers/map-reducer';

interface MapLayerFunctionalityProps {
  curLi: number;
  curCo: number;
  isDragging: boolean;
}

const MapLayerFunctionality: FC<MapLayerFunctionalityProps> = (props) => {
  const { curLi, curCo, isDragging } = props;

  // console.log('<MapLayerFunctionality /> rendered');

  const { operation, brush } = useSelector(mapSelector);
  const d = useDispatch();

  const [previewConfig, setPreviewConfig] = useState({ li: 0, co: 0, canPlace: true });

  const hoveredBuilding = useMemo(() => {
    if (operation !== OperationType.Empty || !curLi || !curCo) {
      return null;
    }
    const { cells, buildings } = MapCore.getInstance();
    const { occupied } = cells[curLi][curCo];
    if (!occupied) {
      return null;
    }
    const b = buildings[occupied];
    if (!canHover(b)) {
      return null;
    }
    const [line, column] = parseBuildingKey(occupied);
    return { ...b, line, column };
  }, [operation, curLi, curCo]);

  const previewBuilding = useMemo(() => {
    if (operation !== OperationType.PlaceBuilding || !curLi || !curCo) {
      return null;
    }
    const { width, height } = brush;
    const [offLi, offCo] = [Math.floor((height - 1) / 2), Math.floor((width - 1) / 2)];
    // 检测是否在地图外面
    if (!isAllInRange(curLi - offLi, curCo - offCo, width - 1, height - 1)) {
      return null;
    }
    const [li, co] = [curLi - offLi, curCo - offCo];
    // 检测是否可以放置
    let canPlace = true;
    const { cells } = MapCore.getInstance();
    for (let i = li; i < li + height; i++) {
      for (let j = co; j < co + width; j++) {
        if (cells[i][j].occupied) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) {
        break;
      }
    }
    setPreviewConfig({ li, co, canPlace });
    return brush;
  }, [operation, curLi, curCo, brush, isDragging]);

  return (
    <Layer
      name="functionality"
      onMouseDown={() => {
        const { li, co } = previewConfig;
        if (
          operation === OperationType.PlaceBuilding &&
          previewConfig.canPlace &&
          previewBuilding
        ) {
          MapCore.getInstance().placeBuilding(brush, li, co);
          d(triggerMapUpdater());
        }
      }}
      onMouseMove={() => {
        if (!isDragging) {
          return;
        }
        const { li, co } = previewConfig;
        if (
          operation === OperationType.PlaceBuilding &&
          previewConfig.canPlace &&
          previewBuilding
        ) {
          MapCore.getInstance().placeBuilding(brush, li, co);
          d(triggerMapUpdater());
        }
      }}>
      {hoveredBuilding && <Building {...hoveredBuilding} isHovered />}
      {previewBuilding && (
        <Building
          line={previewConfig.li}
          column={previewConfig.co}
          {...previewBuilding}
          isPreview
          canPlace={previewConfig.canPlace}
        />
      )}
    </Layer>
  );
};

export default memo(MapLayerFunctionality);
