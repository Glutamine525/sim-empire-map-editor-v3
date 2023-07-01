import React, { memo } from 'react';
import { Button, Dropdown, Menu, Switch } from '@arco-design/web-react';
import { shallow } from 'zustand/shallow';
import { CivilType, CivilTypeLabel, MapType } from '@/map-core/type';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

const MapTypeDropList = () => {
  console.log('MapTypeDropList render');

  const [mapType, changeMapType] = useMapConfig(
    state => [state.mapType, state.changeMapType],
    shallow,
  );

  return (
    <Menu
      onClickMenuItem={data => {
        if (mapType === Number(data)) {
          return;
        }
        changeMapType(Number(data));
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

  const [civil, changeCivil] = useMapConfig(
    state => [state.civil, state.changeCivil],
    shallow,
  );

  return (
    <Menu
      onClickMenuItem={data => {
        if (civil === data) {
          return;
        }
        changeCivil(data as CivilType);
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
          onChange={noTree => {
            changeNoTree(noTree);
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
