import React, {
  FC,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '@arco-design/web-react';
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCheck,
  IconDragArrow,
} from '@arco-design/web-react/icon';
import classcat from 'classcat';
import { parseBuildingKey } from '@/utils/coordinate';
import { BLOCK_PX } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
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
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
  FreeMove = 'FreeMove',
  Confirm = 'Confirm',
}

const buttonIcon = {
  [ButtonType.Top]: <IconArrowUp />,
  [ButtonType.Right]: <IconArrowRight />,
  [ButtonType.Bottom]: <IconArrowDown />,
  [ButtonType.Left]: <IconArrowLeft />,
  [ButtonType.FreeMove]: <IconDragArrow />,
  [ButtonType.Confirm]: <IconCheck />,
};

const MoveArea: FC<MoveAreaProps> = props => {
  const { isHidden, initRow, initCol, curRow, curCol } = props;

  const mapCore = useMapCore();

  const noTree = useMapConfig(state => state.noTree);

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
    color?: string;
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
    const padding = 8;
    const centerX = (w / 2) * BLOCK_PX;
    const centerY = (h / 2) * BLOCK_PX;
    const offsetX = (w / 2) * BLOCK_PX;
    const offsetY = (h / 2) * BLOCK_PX;
    return {
      [ButtonType.Top]: {
        top: centerY - offsetY - buttonSize - padding,
        left: centerX - buttonSize / 2,
      },
      [ButtonType.Right]: {
        top: centerY - buttonSize / 2,
        left: centerX + offsetX + padding,
      },
      [ButtonType.Bottom]: {
        top: centerY + offsetY + padding,
        left: centerX - buttonSize / 2,
      },
      [ButtonType.Left]: {
        top: centerY - buttonSize / 2,
        left: centerX - offsetX - buttonSize - padding,
      },
      [ButtonType.FreeMove]: {
        top: (Math.ceil(h / 2) - 1) * BLOCK_PX - 1,
        left: (Math.ceil(w / 2) - 1) * BLOCK_PX - 1,
      },
      [ButtonType.Confirm]: {
        top: centerY + offsetY - 1,
        left: centerX + offsetX - 1,
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
  }, [noTree]);

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
          color: '',
          offsetRow: curRow - Math.ceil(h / 2) + 1 - row,
          offsetCol: curCol - Math.ceil(w / 2) + 1 - col,
        });
      }}
      onMouseUpCapture={e => {
        const { target } = e;
        if (
          isFreeMoving.current ||
          buttons.current.includes(target as HTMLButtonElement)
        ) {
          isFreeMoving.current = false;
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
                onClickCapture={() => {
                  console.log(type);
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
                  />
                </Fragment>
              );
            })}
            <Block
              className={classcat([styles.area, styles['free-move']])}
              {...freeMoveConfig}
              row={freeMoveConfig.row! + freeMoveConfig.offsetRow!}
              col={freeMoveConfig.col! + freeMoveConfig.offsetCol!}
            />
            {Object.values(ButtonType).map(type => {
              if (type !== ButtonType.Confirm && type !== ButtonType.FreeMove) {
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
                    console.log(type);
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
