import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import Range from '../range';
import { MapCore } from '@/map-core';
import { isAllInRange, isInRange, parseBuildingKey } from '@/utils/coordinate';
import { canHover } from '@/utils/building';
import { useDispatch, useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';
import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import useForceUpdate from '@/hooks/use-force-update';
import Konva from 'konva';
import { cacheBuildings, drawBuildings, removeBuildings } from '../map-layer-buildings/render';
import { getImageFromKonvaNode } from '@/utils/file';
import { triggerMapUpdater } from '@/store/reducers/map-reducer';
import RoadHelper from '../road-helper';
import MoveBlock from '../move-block';
import DeleteBlock from '../delete-block';
import { Html } from 'react-konva-utils';
import FunctionBlockEffect from '../function-block-effect';
import { getArcoColor } from '@/utils/color';

let isDragging = false;
let curLi = 0;
let curCo = 0;
let initLi = -1;
let initCo = -1;
let initX = 0;
let initY = 0;
let processing = false;

const MapLayerFunctionality = () => {
  // console.log('<MapLayerFunctionality /> rendered');

  const { operation, brush } = useSelector(mapSelector);
  const d = useDispatch();

  const cacheRef = useRef<Konva.Group>(null);

  const [previewConfig, setPreviewConfig] = useState({
    li: 0,
    co: 0,
    canPlace: true,
    marker: 0,
    canReplace: false,
  });
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
    // 检测是否可以覆盖
    const building = core.getBuilding(curLi, curCo);
    if (
      building?.isGeneral &&
      building?.width === brush.width &&
      building?.height === brush.height
    ) {
      const [_li, _co] = parseBuildingKey(core.cells[curLi][curCo].occupied);
      setPreviewConfig({
        li: _li,
        co: _co,
        marker: building.marker || 0,
        canPlace: false,
        canReplace: true,
      });
      return brush;
    }
    // 检测是否可以放置
    const [oLi, oCo] = [curLi - offLi, curCo - offCo];
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
    setPreviewConfig({ li: oLi, co: oCo, marker, canPlace, canReplace: false });
    return brush;
  }, [operation, updater, brush]);

  // performance test
  useEffect(() => {
    if (brush.name !== '普通住宅') {
      return;
    }
    for (let li = 1; li < 116; li++) {
      for (let co = 1; co < (116 * 3) / 4; co++) {
        if (!isInRange(li, co)) continue;
        if (core.cells[li][co].occupied) continue;
        core.placeBuilding(brush, li, co);
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
      processing = false;
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
        // 防止地图出现白色闪屏，延迟建筑缓存的消失
        processing = false;
        core.clearBuildingCache();
        d(triggerMapUpdater());
      }, 20);
      setUpdateBuildingLayer(false);
    })();
  }, [updateBuildingLayer]);

  useEffect(() => {
    core.selectCache.clear();
    forceUpdate();
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
        const [li, co] = [Math.ceil(y / UnitPx), Math.ceil(x / UnitPx)];
        console.log(li, co);
        initLi = li;
        initCo = co;
        initX = x;
        initY = y;
        isDragging = true;
        if (
          operation === OperationType.PlaceBuilding &&
          previewConfig.canPlace &&
          previewBuilding &&
          !processing
        ) {
          core.placeBuilding(brush, previewConfig.li, previewConfig.co);
          forceUpdate();
        } else if (previewConfig.canReplace && !processing) {
          core.replaceBuilding(brush, previewConfig.li, previewConfig.co);
          forceUpdate();
        }
      }}
      onMouseMove={(e) => {
        if (operation === OperationType.Empty && isDragging) {
          // 拖拽时禁止设置当前坐标，防止卡顿
          return;
        }
        if (
          [OperationType.MoveBuilding, OperationType.DeleteBuilding].includes(operation) &&
          !isDragging
        ) {
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
          previewBuilding &&
          !processing
        ) {
          core.placeBuilding(brush, previewConfig.li, previewConfig.co);
          forceUpdate();
        } else if (previewConfig.canReplace && !processing) {
          core.replaceBuilding(brush, previewConfig.li, previewConfig.co);
          forceUpdate();
        }
      }}
      onMouseUp={() => {
        isDragging = false;
        if (operation === OperationType.PlaceBuilding) {
          processing = true;
          if (previewBuilding?.isRoad) {
            core.placeStraightRoad(initLi, initCo, curLi, curCo);
          }
          setUpdateBuildingLayer(true);
          initLi = -1;
          initCo = -1;
          return;
        } else if ([OperationType.MoveBuilding, OperationType.DeleteBuilding].includes(operation)) {
          core.selectBuildingInBlock(initLi, initCo, curLi, curCo);
          forceUpdate();
          return;
        }
      }}
      onMouseLeave={() => {
        isDragging = false;
        initLi = -1;
        initCo = -1;
        if (operation !== OperationType.PlaceBuilding) {
          return;
        }
        processing = true;
        setUpdateBuildingLayer(true);
      }}
      onDblClick={() => {
        if (operation !== OperationType.Empty) {
          return;
        }
        if (!core.cells[curLi][curCo].occupied) {
          return;
        }
        const { occupied } = core.cells[curLi][curCo];
        if (core.buildings[occupied].isFixed) {
          return;
        }
        removeBuildings([occupied]);
        setUpdateBuildingLayer(true);
        forceUpdate();
      }}>
      <Rect x={0} y={0} width={MapLength * UnitPx} height={MapLength * UnitPx} />
      <Group ref={cacheRef}>
        {[...core.buildingCache].map((key) => {
          const [line, column] = parseBuildingKey(key);
          const b = core.buildings[key];
          return <Building key={key} line={line} column={column} {...b} />;
        })}
      </Group>
      {[...core.selectCache].map((key) => {
        const [line, column] = parseBuildingKey(key);
        const b = core.buildings[key];
        return <Building key={key} line={line} column={column} {...b} />;
      })}
      {[OperationType.MoveBuilding, OperationType.DeleteBuilding].includes(operation) && (
        <Html>
          {[...core.selectCache].map((key) => {
            const [line, column] = parseBuildingKey(key);
            const b = core.buildings[key];
            return (
              <FunctionBlockEffect
                key={key}
                line={line}
                column={column}
                {...b}
                effectColor={getArcoColor(
                  operation === OperationType.MoveBuilding ? '--blue-5' : '--red-5',
                )}
              />
            );
          })}
        </Html>
      )}
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
          canPlace={previewConfig.canPlace || previewConfig.canReplace}
          hidden={!previewBuilding}
        />
        <Range
          line={previewConfig.li}
          column={previewConfig.co}
          width={previewBuilding?.width}
          height={previewBuilding?.height}
          size={previewBuilding?.range}
          color={previewBuilding?.backgroundColor}
          hidden={
            !previewBuilding ||
            !previewBuilding?.range ||
            (!previewConfig.canPlace && !previewConfig.canReplace)
          }
        />
      </>
      <RoadHelper
        hidden={!previewBuilding?.isRoad || !isDragging}
        initLi={initLi}
        initCo={initCo}
        curLi={curLi}
        curCo={curCo}
      />
      <MoveBlock
        hidden={
          // operation !== OperationType.MoveBuilding || !isDragging || core.selectCache.size === 0
          !(operation === OperationType.MoveBuilding && (isDragging || core.selectCache.size > 0))
        }
        initLi={initLi}
        initCo={initCo}
        curLi={curLi}
        curCo={curCo}
      />
      <DeleteBlock
        hidden={
          operation !== OperationType.DeleteBuilding || !isDragging || core.selectCache.size === 0
        }
        initLi={initLi}
        initCo={initCo}
        curLi={curLi}
        curCo={curCo}
      />
    </Layer>
  );
};

export default memo(MapLayerFunctionality);
