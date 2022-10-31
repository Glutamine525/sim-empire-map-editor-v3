import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import Range from '../range';
import { MapCore } from '@/map-core';
import { getBuildingKey, isAllInRange, isInRange, parseBuildingKey } from '@/utils/coordinate';
import { canHover } from '@/utils/building';
import { useDispatch, useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';
import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import useForceUpdate from '@/hooks/use-force-update';
import Konva from 'konva';
import { cacheBuildings, drawBuildings, removeBuildings } from '../map-layer-buildings/render';
import { getImageFromKonvaNode } from '@/utils/file';
import { triggerMapUpdater } from '@/store/reducers/map-reducer';

let isDragging = false;
let curLi = 0;
let curCo = 0;

const MapLayerFunctionality = () => {
  // console.log('<MapLayerFunctionality /> rendered');

  const { operation, brush } = useSelector(mapSelector);
  const d = useDispatch();

  const cacheRef = useRef<Konva.Group>(null);

  const [previewConfig, setPreviewConfig] = useState({ li: 0, co: 0, canPlace: true, marker: 0 });
  const [updateBuildingLayer, setUpdateBuildingLayer] = useState(false);

  const [updater, forceUpdate] = useForceUpdate();

  const core = useMemo(() => MapCore.getInstance(), []);

  const hoveredBuilding = useMemo(() => {
    if (operation !== OperationType.Empty || !curLi || !curCo) {
      return null;
    }
    const { cells, buildings } = core;
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
  }, [operation, updater]);

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
    const [oLi, oCo] = [curLi - offLi, curCo - offCo];
    // 检测是否可以放置
    let canPlace = true;
    let marker = 0;
    const { cells, getProtectionNum } = core;
    for (let i = oLi; i < oLi + height; i++) {
      for (let j = oCo; j < oCo + width; j++) {
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
    setPreviewConfig({ li: oLi, co: oCo, canPlace, marker });
    return brush;
  }, [operation, updater, brush]);

  // performance test
  useEffect(() => {
    if (brush.name !== '普通住宅') {
      return;
    }
    let count = 0;
    for (let li = 1; li < 116; li++) {
      for (let co = 1; co < (116 * 3) / 4; co++) {
        if (!isInRange(li, co)) continue;
        if (core.cells[li][co].occupied) continue;
        core.placeBuilding(brush, li, co);
        count++;
      }
    }
    setUpdateBuildingLayer(true);
  }, [brush]);

  useEffect(() => {
    if (!updateBuildingLayer) {
      return;
    }
    const { buildingCache } = core;
    if (!buildingCache.size) {
      setUpdateBuildingLayer(false);
      return;
    }
    (async () => {
      let minLi = MapLength;
      let minCo = MapLength;
      for (let key of buildingCache) {
        const [_li, _co] = parseBuildingKey(key);
        minLi = Math.min(minLi, _li);
        minCo = Math.min(minCo, _co);
      }
      await drawBuildings(minLi, minCo, await getImageFromKonvaNode(cacheRef.current!));
      setTimeout(() => {
        core.clearBuildingCache();
        d(triggerMapUpdater());
      }, 20);
      setUpdateBuildingLayer(false);
    })();
  }, [updateBuildingLayer]);

  useEffect(() => {
    if (operation !== OperationType.Empty) {
      return;
    }
    cacheBuildings();
  }, [operation]);

  return (
    <Layer
      name="functionality"
      onMouseDown={(e) => {
        const {
          evt: { offsetX: x, offsetY: y },
        } = e;
        console.log(Math.ceil(y / UnitPx), Math.ceil(x / UnitPx));

        isDragging = true;
        const { li, co } = previewConfig;
        if (
          operation === OperationType.PlaceBuilding &&
          previewConfig.canPlace &&
          previewBuilding
        ) {
          core.placeBuilding(brush, li, co);
          forceUpdate();
        }
      }}
      onMouseMove={(e) => {
        if (operation === OperationType.Empty && isDragging) {
          // 拖拽时禁止设置当前坐标，防止卡顿
          return;
        }
        const {
          evt: { offsetX: x, offsetY: y },
        } = e;
        const co = Math.ceil(x / UnitPx);
        const li = Math.ceil(y / UnitPx);
        if (li !== curLi || co !== curCo) {
          curLi = li;
          curCo = co;
          forceUpdate();
        }
        if (!isDragging) {
          return;
        }
        if (
          operation === OperationType.PlaceBuilding &&
          previewConfig.canPlace &&
          previewBuilding
        ) {
          core.placeBuilding(brush, previewConfig.li, previewConfig.co);
          forceUpdate();
        }
      }}
      onMouseUp={() => {
        isDragging = false;
        if (operation !== OperationType.PlaceBuilding) {
          return;
        }
        setUpdateBuildingLayer(true);
      }}
      onMouseLeave={() => {
        isDragging = false;
        if (operation !== OperationType.PlaceBuilding) {
          return;
        }
        setUpdateBuildingLayer(true);
      }}
      onDblClick={() => {
        if (operation !== OperationType.Empty) {
          return;
        }
        if (!core.cells[curLi][curCo].occupied) {
          return;
        }
        removeBuildings([getBuildingKey(curLi, curCo)]);
      }}>
      <Rect x={0} y={0} width={MapLength * UnitPx} height={MapLength * UnitPx} />
      <Group ref={cacheRef}>
        {[...core.buildingCache].map((key) => {
          const [line, column] = parseBuildingKey(key);
          const b = core.buildings[key];
          return <Building key={key} line={line} column={column} {...b} />;
        })}
      </Group>
      <>
        {/* hoveredBuilding */}
        <Building {...(hoveredBuilding as any)} isHovered hidden={!hoveredBuilding} />
        <Range
          line={hoveredBuilding?.line}
          column={hoveredBuilding?.column}
          width={hoveredBuilding?.width}
          height={hoveredBuilding?.height}
          size={hoveredBuilding?.range}
          color={hoveredBuilding?.backgroundColor}
          hidden={!hoveredBuilding || !hoveredBuilding?.range}
        />
      </>
      <>
        {/* previewBuilding */}
        <Building
          line={previewConfig.li}
          column={previewConfig.co}
          {...(previewBuilding as any)}
          marker={previewBuilding?.isRoad ? 0 : previewConfig.marker}
          isPreview
          canPlace={previewConfig.canPlace}
          hidden={!previewBuilding}
        />
        <Range
          line={previewConfig.li}
          column={previewConfig.co}
          width={previewBuilding?.width}
          height={previewBuilding?.height}
          size={previewBuilding?.range}
          color={previewBuilding?.backgroundColor}
          hidden={!previewBuilding || !previewBuilding?.range || !previewConfig.canPlace}
        />
      </>
    </Layer>
  );
};

export default memo(MapLayerFunctionality);
