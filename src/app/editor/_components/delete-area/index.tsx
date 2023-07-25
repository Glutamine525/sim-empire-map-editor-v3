import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@arco-design/web-react';
import { IconDelete } from '@arco-design/web-react/icon';
import { shallow } from 'zustand/shallow';
import { getBuildingKey, parseBuildingKey } from '@/utils/coordinate';
import DeleteBuildingCommand from '../../_command/delete-buildings';
import { BLOCK_PX } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import { useCommand } from '../../_store/command';
import { useMapConfig } from '../../_store/map-config';
import Block from '../block';
import styles from './index.module.css';

interface DeleteAreaProps {
  isHidden: boolean;
  initRow: number;
  initCol: number;
  curRow: number;
  curCol: number;
}

const DeleteArea: FC<DeleteAreaProps> = props => {
  const { isHidden, initRow, initCol, curRow, curCol } = props;

  const mapCore = useMapCore();
  const addCommand = useCommand(state => state.add);

  const [noTree, resetArea] = useMapConfig(
    state => [state.noTree, state.resetArea],
    shallow,
  );

  const button = useRef<HTMLButtonElement>();

  const [fixedConfig, setFixedConfig] = useState<{
    show: boolean;
    w?: number;
    h?: number;
    row?: number;
    col?: number;
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
    const { row = 0, col = 0, w = 1 } = fixedConfig;
    const top = (row - 1) * BLOCK_PX - 40;
    const left = (col + w / 2 - 1) * BLOCK_PX - 16;
    return { top, left };
  }, [fixedConfig]);

  useEffect(() => {
    if (isHidden) {
      setFixedConfig({ show: false });
    }
  }, [isHidden]);

  useEffect(() => {
    setFixedConfig({ show: false });
  }, [noTree, resetArea]);

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={styles.container}
      onMouseDownCapture={e => {
        const { target } = e;
        if (button.current === target) {
          e.stopPropagation();
          return;
        }
        setFixedConfig({ show: false });
      }}
      onMouseUpCapture={e => {
        const { target } = e;
        if (button.current === target) {
          e.stopPropagation();
          return;
        }
        if (!config.show) {
          setFixedConfig({ show: false });
          return;
        }
        const { w = 1, h = 1, row = 0, col = 0 } = config;
        const keys = new Set<string>();
        for (let r = row; r < row + h; r++) {
          for (let c = col; c < col + w; c++) {
            const { occupied } = mapCore.cells[r][c];
            if (!occupied) {
              continue;
            }
            if (!(occupied in mapCore.buildings)) {
              continue;
            }
            if (mapCore.buildings[occupied].isFixed) {
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
          <Button
            ref={button}
            shape="circle"
            type="primary"
            status="danger"
            icon={<IconDelete />}
            className={styles.button}
            style={buttonStyle}
            onClickCapture={() => {
              const command = new DeleteBuildingCommand();
              for (const key of selectedKeys) {
                const [row, col] = parseBuildingKey(key);
                const building = mapCore.deleteBuilding(row, col);
                if (!building) {
                  continue;
                }
                command.push({
                  building,
                  key: getBuildingKey(building.originRow, building.originCol),
                });
              }
              addCommand(command);
              setSelectedKeys([]);
              setFixedConfig({ show: false });
            }}
          />
        </>
      )}
    </div>
  );
};

export default DeleteArea;
