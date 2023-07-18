import React, {
  FC,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '@arco-design/web-react';
import { IconCheck, IconDragArrow } from '@arco-design/web-react/icon';
import classcat from 'classcat';
import { shallow } from 'zustand/shallow';
import { BuildingConfig } from '@/app/editor/_map-core/building/type';
import { getBuildingKey, parseBuildingKey } from '@/utils/coordinate';
import MoveBuildingCommand from '../../_command/move-buildings';
import { BLOCK_PX } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import { useCommand } from '../../_store/command';
import { useMapConfig } from '../../_store/map-config';
import Block from '../block';
import Building from '../building';
import { mapContainer } from '../map';
import styles from './index.module.css';

interface MoveAreaProps {
  isHidden: boolean;
  initRow: number;
  initCol: number;
  curRow: number;
  curCol: number;
}

enum ButtonType {
  FreeMove = 'FreeMove',
  Confirm = 'Confirm',
}

const buttonIcon = {
  [ButtonType.FreeMove]: <IconDragArrow />,
  [ButtonType.Confirm]: <IconCheck />,
};

const MoveArea: FC<MoveAreaProps> = props => {
  const { isHidden, initRow, initCol, curRow, curCol } = props;

  const mapCore = useMapCore();

  const [noTree, mapRedraw] = useMapConfig(
    state => [state.noTree, state.mapRedraw],
    shallow,
  );
  const addCommand = useCommand(state => state.add);

  const buttons = useRef<HTMLButtonElement[]>([]);
  const freeMoveButtons = useRef<HTMLButtonElement[]>([]);
  const isFreeMoving = useRef(false);

  const [fixedConfig, setFixedConfig] = useState<{
    show: boolean;
    w?: number;
    h?: number;
    row?: number;
    col?: number;
  }>({ show: false });
  const [freeMoveConfig, setFreeMoveConfig] = useState<{
    show: boolean;
    w?: number;
    h?: number;
    row?: number;
    col?: number;
    offsetRow?: number;
    offsetCol?: number;
    color?: 'warning' | 'danger' | 'success' | 'default';
  }>({ show: false });
  const [selectedKeys, setSelectedKeys] = useState([] as string[]);

  const config = useMemo(() => {
    if (!initRow || !initCol) {
      return { show: false };
    }
    const w = Math.abs(curCol - initCol) + 1;
    const h = Math.abs(curRow - initRow) + 1;
    const row = curRow > initRow ? initRow : curRow;
    const col = curCol > initCol ? initCol : curCol;
    return { w, h, row, col, show: true };
  }, [initRow, initCol, curRow, curCol]);

  const buttonStyle = useMemo(() => {
    const { w = 1, h = 1 } = fixedConfig;
    const buttonSize = 32;
    const offset = (buttonSize - BLOCK_PX) / 2;
    return {
      [ButtonType.FreeMove]: {
        top: (Math.ceil(h / 2) - 1) * BLOCK_PX - offset,
        left: (Math.ceil(w / 2) - 1) * BLOCK_PX - offset,
      },
      [ButtonType.Confirm]: {
        top: h * BLOCK_PX - offset,
        left: w * BLOCK_PX - offset,
      },
    };
  }, [fixedConfig]);

  useEffect(() => {
    if (isHidden) {
      setFixedConfig({ show: false });
      setFreeMoveConfig({ show: false });
    }
  }, [isHidden]);

  useEffect(() => {
    setFixedConfig({ show: false });
    setFreeMoveConfig({ show: false });
  }, [noTree, mapRedraw]);

  const selectBuilding = (w = 1, h = 1, row = 0, col = 0) => {
    const keys = new Set<string>();
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) {
        const { occupied } = mapCore.cells[r][c];
        if (!occupied) {
          continue;
        } else if (!(occupied in mapCore.buildings)) {
          continue;
        } else if (mapCore.buildings[occupied].isFixed) {
          continue;
        }
        keys.add(occupied);
      }
    }
    if (!keys.size) {
      setSelectedKeys([]);
      setFixedConfig({ show: false });
      return;
    }
    setSelectedKeys(Array.from(keys));
    setFixedConfig({ w, h, row, col, show: true });
  };

  const deleteAndPlace = (rowDiff: number, colDiff: number) => {
    // 先全部删除，再重新放置
    const cache = [] as { b: BuildingConfig; row: number; col: number }[];
    const command = new MoveBuildingCommand();
    for (const key of selectedKeys) {
      const [row, col] = parseBuildingKey(key);
      const b = mapCore.deleteBuilding(row, col)!;
      cache.push({ b, row, col });
    }
    for (const v of cache) {
      const { b, row, col } = v;
      mapCore.placeBuilding(b, row + rowDiff, col + colDiff);
      command.push({
        building: b,
        key: getBuildingKey(row + rowDiff, col + colDiff),
        oldKey: getBuildingKey(row, col),
      });
    }
    mapCore.roadCache.clear();
    addCommand(command);
    const { w = 1, h = 1, row = 0, col = 0 } = fixedConfig;
    selectBuilding(w, h, row + rowDiff, col + colDiff);
  };

  const getFreeMoveColor = () => {
    const { color } = freeMoveConfig;
    return typeof color === 'undefined' ? 'gray' : color;
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={styles.container}
      onMouseDownCapture={e => {
        const { target } = e;
        if (buttons.current.includes(target as HTMLButtonElement)) {
          if (freeMoveButtons.current.includes(target as HTMLButtonElement)) {
            isFreeMoving.current = true;
          }
          e.stopPropagation();
          return;
        }
        setFixedConfig({ show: false });
        setFreeMoveConfig({ show: false });
      }}
      onMouseMoveCapture={e => {
        if (!isFreeMoving.current) {
          return;
        }
        const {
          nativeEvent: { pageX, pageY },
        } = e;
        const { scrollLeft, scrollTop } = mapContainer.current!;
        const { left, top } = mapContainer.current!.getBoundingClientRect();
        const curRow = Math.ceil(
          (scrollTop + pageY - top - BLOCK_PX) / BLOCK_PX,
        );
        const curCol = Math.ceil(
          (scrollLeft + pageX - left - BLOCK_PX) / BLOCK_PX,
        );
        const { w = 1, h = 1, row = 0, col = 0 } = fixedConfig;
        setFreeMoveConfig({
          ...fixedConfig,
          offsetRow: curRow - Math.ceil(h / 2) + 1 - row,
          offsetCol: curCol - Math.ceil(w / 2) + 1 - col,
        });
      }}
      onMouseUpCapture={e => {
        if (isFreeMoving.current) {
          isFreeMoving.current = false;
          const { offsetRow = 0, offsetCol = 0 } = freeMoveConfig;
          if (!offsetRow && !offsetCol) {
            setFreeMoveConfig({ show: false });
            return;
          }
          for (const key of selectedKeys) {
            const [row, col] = parseBuildingKey(key);
            const { w = 1, h = 1 } = mapCore.buildings[key];
            for (let i = row + offsetRow; i < row + offsetRow + h; i++) {
              for (let j = col + offsetCol; j < col + offsetCol + w; j++) {
                const { isInRange, occupied } = mapCore.cells[i][j];
                if (!isInRange) {
                  setFreeMoveConfig({ show: false });
                  return;
                }
                if (occupied && !selectedKeys.includes(occupied)) {
                  setFreeMoveConfig(state => ({ ...state, color: 'danger' }));
                  return;
                }
              }
            }
          }
          setFreeMoveConfig(state => ({ ...state, color: 'success' }));
          return;
        }
        const { target } = e;
        if (buttons.current.includes(target as HTMLButtonElement)) {
          e.stopPropagation();
          return;
        }
        if (!config.show) {
          setFixedConfig({ show: false });
          return;
        }
        const { w, h, row, col } = config;
        selectBuilding(w, h, row, col);
      }}
    >
      {config.show && !fixedConfig.show && (
        <Block className={styles.area} {...config} />
      )}
      {fixedConfig.show && (
        <>
          {selectedKeys.map(key => {
            const [row, col] = parseBuildingKey(key);
            const { w, h } = mapCore.buildings[key];
            return (
              <Block
                key={key}
                row={row}
                col={col}
                w={w}
                h={h}
                className={styles['selected-building']}
              />
            );
          })}
          <Block className={styles.area} {...fixedConfig} />
          {Object.values(ButtonType).map(type => {
            if (type === ButtonType.Confirm) {
              return null;
            }
            return (
              <Button
                ref={dom => {
                  if (type === ButtonType.FreeMove) {
                    freeMoveButtons.current.push(dom as HTMLButtonElement);
                  }
                  buttons.current.push(dom as HTMLButtonElement);
                }}
                key={type}
                shape="circle"
                type="primary"
                icon={buttonIcon[type]}
                className={styles.button}
                style={{
                  top:
                    (fixedConfig.row! - 1) * BLOCK_PX + buttonStyle[type].top,
                  left:
                    (fixedConfig.col! - 1) * BLOCK_PX + buttonStyle[type].left,
                }}
              />
            );
          })}
        </>
      )}
      {freeMoveConfig.show && (
        <>
          <>
            {selectedKeys.map(key => {
              const [row, col] = parseBuildingKey(key);
              const b = mapCore.buildings[key];
              return (
                <Fragment key={key}>
                  <Building
                    {...b}
                    row={row + freeMoveConfig.offsetRow!}
                    col={col + freeMoveConfig.offsetCol!}
                    className={styles['free-move']}
                  />
                  <Block
                    row={row + freeMoveConfig.offsetRow!}
                    col={col + freeMoveConfig.offsetCol!}
                    w={b.w}
                    h={b.h}
                    className={classcat([
                      styles['selected-building'],
                      styles['free-move'],
                    ])}
                    style={{
                      boxShadow: `inset 0 0 16px 2px rgb(var(--${getFreeMoveColor()}-3))`,
                    }}
                  />
                </Fragment>
              );
            })}
            <Block
              className={classcat([styles.area, styles['free-move']])}
              {...freeMoveConfig}
              row={freeMoveConfig.row! + freeMoveConfig.offsetRow!}
              col={freeMoveConfig.col! + freeMoveConfig.offsetCol!}
              style={{
                borderColor: `rgb(var(--${getFreeMoveColor()}-7))`,
                background: `rgba(var(--${getFreeMoveColor()}-5), 0.4)`,
              }}
            />
            {Object.values(ButtonType).map(type => {
              if (
                freeMoveConfig.color !== 'success' &&
                type === ButtonType.Confirm
              ) {
                return null;
              }

              return (
                <Button
                  ref={dom => {
                    if (type === ButtonType.FreeMove) {
                      freeMoveButtons.current.push(dom as HTMLButtonElement);
                    }
                    buttons.current.push(dom as HTMLButtonElement);
                  }}
                  key={type}
                  shape="circle"
                  type="primary"
                  icon={buttonIcon[type]}
                  className={classcat([styles.button, styles['free-move']])}
                  style={{
                    background: `rgb(var(--${getFreeMoveColor()}-5))`,
                    top:
                      (freeMoveConfig.row! + freeMoveConfig.offsetRow! - 1) *
                        BLOCK_PX +
                      buttonStyle[type].top,
                    left:
                      (freeMoveConfig.col! + freeMoveConfig.offsetCol! - 1) *
                        BLOCK_PX +
                      buttonStyle[type].left,
                  }}
                  onClickCapture={() => {
                    if (type !== ButtonType.Confirm) {
                      return;
                    }
                    const { offsetRow = 0, offsetCol = 0 } = freeMoveConfig;
                    deleteAndPlace(offsetRow, offsetCol);
                    setFreeMoveConfig({ show: false });
                  }}
                />
              );
            })}
          </>
        </>
      )}
    </div>
  );
};

export default MoveArea;
