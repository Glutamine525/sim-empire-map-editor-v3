import React, { memo } from 'react';
import { Button, Dropdown, Menu, Modal, Switch } from '@arco-design/web-react';
import { shallow } from 'zustand/shallow';
import MapCore from '@/app/editor/_map-core';
import {
  BarrierType,
  BuildingFixed,
} from '@/app/editor/_map-core/building/fixed';
import {
  CivilType,
  CivilTypeLabel,
  MapType,
  OperationType,
} from '@/app/editor/_map-core/type';
import { getBuildingKey, parseBuildingKey } from '@/utils/coordinate';
import ChangeNoTreeCommand from '../../_command/change-no-tree';
import { useCommand } from '../../_store/command';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

const mapCore = MapCore.getInstance();

const MapTypeDropList = () => {
  console.log('MapTypeDropList render');

  const [mapType, changeMapType, changeOperation, triggerMapRedraw] =
    useMapConfig(
      state => [
        state.mapType,
        state.changeMapType,
        state.changeOperation,
        state.triggerMapRedraw,
      ],
      shallow,
    );

  return (
    <Menu
      onClickMenuItem={async data => {
        if (mapType === Number(data)) {
          return;
        }
        if (mapCore.hasPlacedBuilding()) {
          const isOk = await new Promise<boolean>(resolve => {
            Modal.confirm({
              title: '提示',
              content:
                '更改地图类型后会清空所有已放置的建筑，是否确认当前操作？',
              onOk: () => {
                resolve(true);
              },
              onCancel: () => {
                resolve(false);
              },
            });
          });
          if (!isOk) {
            return;
          }
        }
        changeOperation(OperationType.Empty);
        changeMapType(Number(data));
        triggerMapRedraw();
      }}
    >
      {Object.values(MapType).map(type => {
        if (typeof type === 'string') {
          return null;
        }
        return <Menu.Item key={type.toString()}>{type}</Menu.Item>;
      })}
    </Menu>
  );
};

const CivilDropList = () => {
  console.log('CivilDropList render');

  const [civil, changeCivil, changeOperation, triggerMapRedraw] = useMapConfig(
    state => [
      state.civil,
      state.changeCivil,
      state.changeOperation,
      state.triggerMapRedraw,
    ],
    shallow,
  );

  return (
    <Menu
      onClickMenuItem={async data => {
        if (civil === data) {
          return;
        }
        if (mapCore.hasPlacedBuilding()) {
          const isOk = await new Promise<boolean>(resolve => {
            Modal.confirm({
              title: '提示',
              content: '更改文明后会清空所有已放置的建筑，是否确认当前操作？',
              onOk: () => {
                resolve(true);
              },
              onCancel: () => {
                resolve(false);
              },
            });
          });
          if (!isOk) {
            return;
          }
        }
        changeOperation(OperationType.Empty);
        changeCivil(data as CivilType);
        triggerMapRedraw();
      }}
    >
      {Object.entries(CivilTypeLabel).map(entry => {
        const [civil, civilLabel] = entry;
        if (civil === CivilType.Custom) {
          return null;
        }
        return <Menu.Item key={civil}>{civilLabel}</Menu.Item>;
      })}
    </Menu>
  );
};

const TopMenuController = () => {
  console.log('TopMenuController render');

  const [mapType, civil, noTree, rotated, changeNoTree, changeRotated] =
    useMapConfig(
      state => [
        state.mapType,
        state.civil,
        state.noTree,
        state.rotated,
        state.changeNoTree,
        state.changeRotated,
      ],
      shallow,
    );
  const addCommand = useCommand(state => state.add);

  return (
    <div className={styles.container}>
      <div>
        <div>地图:</div>
        <Dropdown droplist={MapTypeDropList()}>
          <Button type="text" className={styles['dropdown-button']}>
            {mapType}
          </Button>
        </Dropdown>
      </div>
      <div>
        <div>文明:</div>
        <Dropdown droplist={CivilDropList()}>
          <Button type="text" className={styles['dropdown-button']}>
            {CivilTypeLabel[civil]}
          </Button>
        </Dropdown>
      </div>
      <div>
        <div>无木:</div>
        <Switch
          checked={noTree}
          onChange={async noTree => {
            const command = new ChangeNoTreeCommand(noTree);
            if (!noTree) {
              const keys = BuildingFixed[BarrierType.Tree][mapType - 3];
              let hasOccupied = false;
              for (const key of keys) {
                const [row, col] = parseBuildingKey(key);
                if (mapCore.cells[row][col].occupied) {
                  hasOccupied = true;
                  break;
                }
              }
              if (hasOccupied) {
                const isOk = await new Promise<boolean>(resolve => {
                  Modal.confirm({
                    title: '提示',
                    content:
                      '检测到有建筑占用了树木的位置，关闭无木之地后，这些建筑会被强制删除，是否确认当前操作？',
                    onOk: () => {
                      resolve(true);
                    },
                    onCancel: () => {
                      resolve(false);
                    },
                  });
                });
                if (!isOk) {
                  return;
                }
                for (const key of keys) {
                  const [row, col] = parseBuildingKey(key);
                  const building = mapCore.deleteBuilding(row, col);
                  if (building) {
                    command.push({
                      building,
                      key: getBuildingKey(
                        building.originRow,
                        building.originCol,
                      ),
                    });
                  }
                }
              }
            }
            addCommand(command);
            changeNoTree(noTree);
            mapCore.toggleNoTree(noTree);
          }}
        />
      </div>
      <div>
        <div>旋转:</div>
        <Switch
          checked={rotated}
          onChange={rotated => {
            changeRotated(rotated);
          }}
        />
      </div>
    </div>
  );
};

export default memo(TopMenuController);
