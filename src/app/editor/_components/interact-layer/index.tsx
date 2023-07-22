import React, { useMemo, useRef, useState } from 'react';
import { Message, Notification } from '@arco-design/web-react';
import { useKeyPress } from 'ahooks';
import { shallow } from 'zustand/shallow';
import { BLOCK_PX, IS_MAC, IS_WINDOWS } from '@/app/editor/_config';
import { MapLength, OperationType } from '@/app/editor/_map-core/type';
import { canHover, showMarker } from '@/utils/building';
import {
  getBuildingKey,
  isAllInRange,
  parseBuildingKey,
} from '@/utils/coordinate';
import DeleteBuildingCommand from '../../_command/delete-buildings';
import PlaceBuildingCommand from '../../_command/place-buildings';
import useMapCore from '../../_hooks/use-map-core';
import { CatalogType } from '../../_map-core/building/type';
import { useCommand } from '../../_store/command';
import { useMapConfig } from '../../_store/map-config';
import { useSetting } from '../../_store/settings';
import BlockHighlight, { HighlightType } from '../block-highlight';
import Building from '../building';
import Copyright from '../copyright';
import DeleteArea from '../delete-area';
import { mapContainer } from '../map';
import MiniMap from '../mini-map';
import MoveArea from '../move-area';
import Range from '../range';
import ResidenceRequirement from '../residence-requirement';
import RoadHelper from '../road-helper';
import styles from './index.module.css';

const InteractLayer = () => {
  console.log('InteractLayer render');

  const mapCore = useMapCore();
  const [operation, brush, changeOperation, changeBrush] = useMapConfig(
    state => [
      state.operation,
      state.brush,
      state.changeOperation,
      state.changeBrush,
    ],
    shallow,
  );
  const addCommand = useCommand(state => state.add);
  const [
    enableInteractLayerShortcut,
    enableDoubleClickDelete,
    enableResidenceRequirementQuery,
    enableProtectionHighlight,
  ] = useSetting(
    state => [
      state.enableInteractLayerShortcut,
      state.enableDoubleClickDelete,
      state.enableResidenceRequirementQuery,
      state.enableProtectionHighlight,
    ],
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
    protections: [] as string[],
  });
  const [requirementConfig, setRequirementConfig] = useState({
    show: false,
    row: 0,
    col: 0,
    w: 0,
    h: 0,
  });

  const placeCommand = useRef<PlaceBuildingCommand>();

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
    const protectionKeys = new Set<string>();
    const { cells, getProtections } = mapCore;
    const building = mapCore.getBuilding(row, col);
    if (
      building?.isGeneral &&
      building?.w === w &&
      building?.h === h &&
      !brush.isGeneral
    ) {
      const [_row, _col] = parseBuildingKey(mapCore.cells[row][col].occupied);
      if (showMarker(brush) && !brush.isRoad) {
        for (let i = _row; i < _row + h; i++) {
          for (let j = _col; j < _col + w; j++) {
            const { protection } = cells[i][j];
            for (const p in protection) {
              for (const key of protection[p]) {
                protectionKeys.add(key);
              }
            }
          }
        }
      }
      setPreviewConfig({
        row: _row,
        col: _col,
        marker: building.marker || 0,
        canPlace: false,
        canReplace: true,
        protections: Array.from(protectionKeys),
      });
      return brush;
    }
    // 检测是否可以放置
    const [offRow, offCol] = [row - offH, col - offW];
    let canPlace = true;
    const protections = new Set<string>();
    for (let i = offRow; i < offRow + h; i++) {
      for (let j = offCol; j < offCol + w; j++) {
        const { protection, occupied } = cells[i][j];
        if (occupied) {
          canPlace = false;
          break;
        }
        if (!showMarker(brush) || brush.isRoad) {
          continue;
        }
        const p = getProtections(i, j);
        for (const v of p) {
          protections.add(v);
        }
        for (const p in protection) {
          for (const key of protection[p]) {
            protectionKeys.add(key);
          }
        }
      }
      if (!canPlace) {
        break;
      }
    }
    setPreviewConfig({
      row: offRow,
      col: offCol,
      marker: protections.size,
      canPlace,
      canReplace: false,
      protections: Array.from(protectionKeys),
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
    const { w = 1, h = 1 } = b;
    const [r, c] = parseBuildingKey(occupied);
    const protections = new Set<string>();
    if (showMarker(b)) {
      for (let i = r; i < r + h; i++) {
        for (let j = c; j < c + w; j++) {
          const { protection } = mapCore.cells[i][j];
          for (const p in protection) {
            for (const key of protection[p]) {
              protections.add(key);
            }
          }
        }
      }
    }
    return { ...b, row: r, col: c, protections: Array.from(protections) };
  }, [operation, mouseCoord]);

  // copy building
  useKeyPress('c', e => {
    if (!hoverBuilding || !enableInteractLayerShortcut) {
      return;
    }
    if ((IS_WINDOWS && !e.ctrlKey) || (IS_MAC && !e.metaKey)) {
      return;
    }
    e.preventDefault();
    if (hoverBuilding.isFixed) {
      Message.warning({ content: '固定建筑不允许复制~', id: 'copy-message' });
      return;
    }
    const { row: _r, col: _c, ...b } = hoverBuilding;
    changeOperation(OperationType.PlaceBuilding);
    changeBrush(b);
  });

  const resetState = () => {
    setIsMouseDown(false);
    setOriginMousePos({ x: 0, y: 0, row: 0, col: 0 });
    setMouseCoord({ row: 0, col: 0 });
  };

  return (
    <div
      className={styles.container}
      style={{
        width: MapLength * BLOCK_PX,
        height: MapLength * BLOCK_PX,
        margin: BLOCK_PX,
      }}
      onMouseDown={e => {
        if (e.button !== 0) {
          return;
        }

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
          placeCommand.current = new PlaceBuildingCommand();
          if (previewConfig.canPlace) {
            mapCore.placeBuilding(brush!, previewConfig.row, previewConfig.col);
            placeCommand.current.push({
              type: 'place',
              key: getBuildingKey(previewConfig.row, previewConfig.col),
              building: brush!,
            });
            setMouseCoord({ row, col });
          } else if (previewConfig.canReplace) {
            mapCore.replaceBuilding(
              brush!,
              previewConfig.row,
              previewConfig.col,
            );
            placeCommand.current.push({
              type: 'replace',
              key: getBuildingKey(previewConfig.row, previewConfig.col),
              building: brush!,
            });
            setMouseCoord({ row, col });
          }
        }
      }}
      onMouseMove={e => {
        if (e.button !== 0) {
          return;
        }

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
            placeCommand.current?.push({
              type: 'place',
              key: getBuildingKey(previewConfig.row, previewConfig.col),
              building: brush!,
            });
            setMouseCoord({ row, col });
          } else if (previewConfig.canReplace) {
            mapCore.replaceBuilding(
              brush!,
              previewConfig.row,
              previewConfig.col,
            );
            placeCommand.current?.push({
              type: 'replace',
              key: getBuildingKey(previewConfig.row, previewConfig.col),
              building: brush!,
            });
            setMouseCoord({ row, col });
          }
        }
      }}
      onMouseUp={e => {
        if (e.button !== 0) {
          return;
        }
        setIsMouseDown(false);
        if (operation === OperationType.PlaceBuilding) {
          if (brush?.isRoad) {
            const keys = mapCore.placeStraightRoad(
              originMousePos.row,
              originMousePos.col,
              mouseCoord.row,
              mouseCoord.col,
            );
            if (keys.length) {
              placeCommand.current?.reset();
              keys.map(key =>
                placeCommand.current?.push({
                  type: 'place',
                  key,
                  building: brush,
                }),
              );
            }
          }
          if (placeCommand.current?.len()) {
            addCommand(placeCommand.current);
          }
        }
        setOriginMousePos({ x: 0, y: 0, row: 0, col: 0 });
      }}
      onDoubleClick={() => {
        if (operation !== OperationType.Empty || !enableDoubleClickDelete) {
          return;
        }
        const { row, col } = mouseCoord;
        const deletedBuilding = mapCore.deleteBuilding(row, col);
        if (deletedBuilding) {
          setMouseCoord({ row, col });
          const c = new DeleteBuildingCommand();
          c.push({
            building: deletedBuilding,
            key: getBuildingKey(
              deletedBuilding.originRow,
              deletedBuilding.originCol,
            ),
          });
          addCommand(c);
        }
      }}
      onMouseLeave={() => {
        resetState();
      }}
      onContextMenu={e => {
        e.preventDefault();
        if (
          operation !== OperationType.Empty ||
          !enableResidenceRequirementQuery
        ) {
          return;
        }
        if (hoverBuilding?.catalog !== CatalogType.Residence) {
          return;
        }
        setRequirementConfig({
          show: true,
          row: hoverBuilding.row,
          col: hoverBuilding.col,
          w: hoverBuilding.w!,
          h: hoverBuilding.h!,
        });
        Notification.info({
          id: 'residence-requirement',
          title: '住宅需求查询',
          content: <ResidenceRequirement {...hoverBuilding} />,
          position: 'bottomRight',
          onClose: () => {
            setRequirementConfig({ show: false, row: 0, col: 0, w: 0, h: 0 });
          },
        });
      }}>
      {/* hover building */}
      <Building isHidden={!hoverBuilding} isHovered={true} {...hoverBuilding} />
      <Range
        isHidden={!hoverBuilding || !hoverBuilding.range}
        {...hoverBuilding}
      />
      {enableProtectionHighlight &&
        hoverBuilding?.protections.map(key => {
          const { w = 1, h = 1 } = mapCore.buildings[key];
          const [r, c] = parseBuildingKey(key);
          return (
            <BlockHighlight
              key={key}
              type={HighlightType.Protection}
              w={w}
              h={h}
              row={r}
              col={c}
            />
          );
        })}
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
      {enableProtectionHighlight &&
        Boolean(previewBuilding) &&
        previewConfig?.protections.map(key => {
          const { w = 1, h = 1 } = mapCore.buildings[key];
          const [r, c] = parseBuildingKey(key);
          return (
            <BlockHighlight
              key={key}
              type={HighlightType.Protection}
              w={w}
              h={h}
              row={r}
              col={c}
            />
          );
        })}
      <RoadHelper
        isHidden={operation !== OperationType.PlaceBuilding || !brush?.isRoad}
        initRow={originMousePos.row}
        initCol={originMousePos.col}
        curRow={mouseCoord.row}
        curCol={mouseCoord.col}
      />
      {/* functional */}
      {requirementConfig.show && (
        <BlockHighlight
          type={HighlightType.Requirement}
          w={requirementConfig.w}
          h={requirementConfig.h}
          row={requirementConfig.row}
          col={requirementConfig.col}
        />
      )}
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
      <MiniMap onMouseEnter={() => resetState()} />
      <Copyright isInteractLayer={true} />
    </div>
  );
};

export default InteractLayer;
