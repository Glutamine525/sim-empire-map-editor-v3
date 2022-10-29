import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { Layer } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import Range from '../range';
import { MapCore } from '@/map-core';
import { isAllInRange, isInRange, parseBuildingKey } from '@/utils/coordinate';
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

  const { operation, brush, mapUpdater } = useSelector(mapSelector);
  const d = useDispatch();

  const [previewConfig, setPreviewConfig] = useState({ li: 0, co: 0, canPlace: true, marker: 0 });

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
  }, [operation, curLi, curCo, mapUpdater]);

  const previewBuilding = useMemo(() => {
    if (operation !== OperationType.PlaceBuilding || !curLi || !curCo) {
      return null;
    }
    const { width, height } = brush;
    const [offLi, offCo] = [Math.floor((height - 1) / 2), Math.floor((width - 1) / 2)];
    // 检测是否在地图范围内
    if (!isAllInRange(curLi - offLi, curCo - offCo, width - 1, height - 1)) {
      return null;
    }
    const [li, co] = [curLi - offLi, curCo - offCo];
    // 检测是否可以放置
    let canPlace = true;
    let marker = 0;
    const { cells, getProtectionNum } = MapCore.getInstance();
    for (let i = li; i < li + height; i++) {
      for (let j = co; j < co + width; j++) {
        if (cells[i][j].occupied) {
          canPlace = false;
          break;
        }
        marker = Math.max(marker, getProtectionNum(i, j));
      }
      if (!canPlace) {
        break;
      }
    }
    setPreviewConfig({ li, co, canPlace, marker });
    return brush;
  }, [operation, curLi, curCo, brush, mapUpdater]);

  // performance test
  useEffect(() => {
    if (brush.name !== '普通住宅') {
      return;
    }
    let count = 0;
    for (let li = 1; li < 116; li++) {
      for (let co = 1; co < 116; co++) {
        if (!isInRange(li, co)) continue;
        const core = MapCore.getInstance();
        if (core.cells[li][co].occupied) continue;
        MapCore.getInstance().placeBuilding(brush, li, co);
        count++;
      }
    }
    d(triggerMapUpdater());
  }, [brush]);

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
      {hoveredBuilding && (
        <>
          <Building {...hoveredBuilding} isHovered />
          {Boolean(hoveredBuilding.range) && (
            <Range
              line={hoveredBuilding.line}
              column={hoveredBuilding.column}
              width={hoveredBuilding.width}
              height={hoveredBuilding.height}
              size={hoveredBuilding.range!}
              color={hoveredBuilding.backgroundColor!}
            />
          )}
        </>
      )}
      {previewBuilding && (
        <>
          <Building
            line={previewConfig.li}
            column={previewConfig.co}
            {...previewBuilding}
            marker={previewBuilding.isRoad ? 0 : previewConfig.marker}
            isPreview
            canPlace={previewConfig.canPlace}
          />
          {previewConfig.canPlace && Boolean(previewBuilding.range) && (
            <Range
              line={previewConfig.li}
              column={previewConfig.co}
              width={previewBuilding.width}
              height={previewBuilding.height}
              size={previewBuilding.range!}
              color={previewBuilding.backgroundColor!}
            />
          )}
        </>
      )}
    </Layer>
  );
};

export default memo(MapLayerFunctionality);
