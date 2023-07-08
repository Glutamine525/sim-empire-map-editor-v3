import React, { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { BLOCK_PX } from '@/app/editor/_config';
import { MapLength, OperationType } from '@/map-core/type';
import { canHover } from '@/utils/building';
import { isAllInRange, parseBuildingKey } from '@/utils/coordinate';
import useMapCore from '../../_hooks/use-map-core';
import { useMapConfig } from '../../_store/map-config';
import Building from '../building';
import DeleteArea from '../delete-area';
import { mapContainer } from '../map';
import MiniMap from '../mini-map';
import MoveArea from '../move-area';
import Range from '../range';
import RoadHelper from '../road-helper';
import styles from './index.module.css';

const InteractLayer = () => {
  console.log('InteractLayer render');

  const mapCore = useMapCore();
  const [operation, brush] = useMapConfig(
    state => [state.operation, state.brush],
    shallow,
  );

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [originMousePos, setOriginMousePos] = useState({
    x: 0,
    y: 0,
    row: 0,
    col: 0,
  });
  const [mouseCoord, setMouseCoord] = useState({ row: 0, col: 0 });
  const [previewConfig, setPreviewConfig] = useState({
    row: 0,
    col: 0,
    canPlace: true,
    marker: 0,
    canReplace: false,
  });

  const previewBuilding = useMemo(() => {
    const { row, col } = mouseCoord;
    if (operation !== OperationType.PlaceBuilding || !row || !col || !brush) {
      return;
    }
    const { w, h } = brush;
    if (!w || !h) {
      return;
    }
    const [offH, offW] = [Math.floor((h - 1) / 2), Math.floor((w - 1) / 2)];
    // 检测是否在地图范围内
    if (!isAllInRange(row - offH, col - offW, w - 1, h - 1)) {
      return;
    }
    // 检测是否可以覆盖
    const building = mapCore.getBuilding(row, col);
    if (
      building?.isGeneral &&
      building?.w === w &&
      building?.h === h &&
      !brush.isGeneral
    ) {
      const [_row, _col] = parseBuildingKey(mapCore.cells[row][col].occupied);
      setPreviewConfig({
        row: _row,
        col: _col,
        marker: building.marker || 0,
        canPlace: false,
        canReplace: true,
      });
      return brush;
    }
    // 检测是否可以放置
    const [offRow, offCol] = [row - offH, col - offW];
    let canPlace = true;
    let marker = 0;
    const { cells, getProtectionNum } = mapCore;
    for (let i = offRow; i < offRow + h; i++) {
      for (let j = offCol; j < offCol + w; j++) {
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
    setPreviewConfig({
      row: offRow,
      col: offCol,
      marker,
      canPlace,
      canReplace: false,
    });
    return brush;
  }, [operation, brush, mouseCoord]);

  const hoverBuilding = useMemo(() => {
    const { row, col } = mouseCoord;
    if (operation !== OperationType.Empty || !row || !col) {
      return;
    }
    const { occupied } = mapCore.cells[row][col];
    if (!occupied) {
      return;
    }
    const b = mapCore.buildings[occupied];
    if (!canHover(b)) {
      return;
    }
    const [r, c] = parseBuildingKey(occupied);
    return { ...b, row: r, col: c };
  }, [operation, mouseCoord]);

  return (
    <div
      className={styles.container}
      style={{
        width: MapLength * BLOCK_PX,
        height: MapLength * BLOCK_PX,
        margin: BLOCK_PX,
      }}
      onMouseDown={e => {
        const {
          nativeEvent: { offsetX, offsetY },
          clientX,
          clientY,
        } = e;

        const row = Math.ceil(offsetY / BLOCK_PX);
        const col = Math.ceil(offsetX / BLOCK_PX);
        setIsMouseDown(true);
        setOriginMousePos({
          x: mapContainer.current!.scrollLeft + clientX,
          y: mapContainer.current!.scrollTop + clientY,
          row,
          col,
        });

        if (operation === OperationType.PlaceBuilding) {
          if (previewConfig.canPlace) {
            mapCore.placeBuilding(brush!, previewConfig.row, previewConfig.col);
            setMouseCoord({ row, col });
          } else if (previewConfig.canReplace) {
            mapCore.replaceBuilding(
              brush!,
              previewConfig.row,
              previewConfig.col,
            );
            setMouseCoord({ row, col });
          }
        }
      }}
      onMouseMove={e => {
        const {
          nativeEvent: { offsetX, offsetY },
          clientX,
          clientY,
        } = e;

        const row = Math.ceil(offsetY / BLOCK_PX);
        const col = Math.ceil(offsetX / BLOCK_PX);

        if (row !== mouseCoord.row || col !== mouseCoord.col) {
          if (operation !== OperationType.Empty || !isMouseDown) {
            setMouseCoord({ row, col });
          }
        }

        if (!isMouseDown) {
          return;
        }

        if (operation === OperationType.Empty) {
          mapContainer.current!.scrollLeft = originMousePos.x - clientX;
          mapContainer.current!.scrollTop = originMousePos.y - clientY;
        } else if (operation === OperationType.PlaceBuilding) {
          if (previewConfig.canPlace) {
            mapCore.placeBuilding(brush!, previewConfig.row, previewConfig.col);
            setMouseCoord({ row, col });
          } else if (previewConfig.canReplace) {
            mapCore.replaceBuilding(
              brush!,
              previewConfig.row,
              previewConfig.col,
            );
            setMouseCoord({ row, col });
          }
        }
      }}
      onMouseUp={() => {
        setIsMouseDown(false);
        if (operation === OperationType.PlaceBuilding) {
          if (brush?.isRoad) {
            mapCore.placeStraightRoad(
              originMousePos.row,
              originMousePos.col,
              mouseCoord.row,
              mouseCoord.col,
            );
          }
        }
        setOriginMousePos({ x: 0, y: 0, row: 0, col: 0 });
      }}
      onDoubleClick={() => {
        if (operation !== OperationType.Empty) {
          return;
        }
        const { row, col } = mouseCoord;
        const deletedBuilding = mapCore.deleteBuilding(row, col);
        if (deletedBuilding) {
          setMouseCoord({ row, col });
          // add operation history
        }
      }}
      onMouseLeave={() => {
        setIsMouseDown(false);
        setOriginMousePos({ x: 0, y: 0, row: 0, col: 0 });
        setMouseCoord({ row: 0, col: 0 });
      }}
    >
      {/* hover building */}
      <Building isHidden={!hoverBuilding} isHovered={true} {...hoverBuilding} />
      <Range
        isHidden={!hoverBuilding || !hoverBuilding.range}
        {...hoverBuilding}
      />
      {/* preview building */}
      <Building
        isHidden={!previewBuilding}
        {...previewConfig}
        {...previewBuilding}
        isPreview={true}
        marker={previewBuilding?.isRoad ? 0 : previewConfig?.marker}
        canPlace={previewConfig.canPlace || previewConfig.canReplace}
      />
      <Range
        isHidden={
          !previewBuilding ||
          !previewBuilding.range ||
          (!previewConfig.canPlace && !previewConfig.canReplace)
        }
        {...previewConfig}
        {...previewBuilding}
      />
      <RoadHelper
        isHidden={operation !== OperationType.PlaceBuilding || !brush?.isRoad}
        initRow={originMousePos.row}
        initCol={originMousePos.col}
        curRow={mouseCoord.row}
        curCol={mouseCoord.col}
      />
      {/* functional */}
      <MoveArea
        isHidden={operation !== OperationType.MoveBuilding}
        initRow={originMousePos.row}
        initCol={originMousePos.col}
        curRow={mouseCoord.row}
        curCol={mouseCoord.col}
      />
      <DeleteArea
        isHidden={operation !== OperationType.DeleteBuilding}
        initRow={originMousePos.row}
        initCol={originMousePos.col}
        curRow={mouseCoord.row}
        curCol={mouseCoord.col}
      />
      <MiniMap
        onMouseEnter={() => {
          setIsMouseDown(false);
          setOriginMousePos({ x: 0, y: 0, row: 0, col: 0 });
          setMouseCoord({ row: 0, col: 0 });
        }}
      />
    </div>
  );
};

export default InteractLayer;
