import React from 'react';
import { Button, Dropdown, Menu } from '@arco-design/web-react';
import { shallow } from 'zustand/shallow';
import { MapType } from '@/map-core/type';
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

const TopMenuMapType = () => {
  console.log('TopMenuMapType render');

  const mapType = useMapConfig(state => state.mapType);

  return (
    <div>
      <div>地图:</div>
      <Dropdown droplist={MapTypeDropList()}>
        <Button type="text" className={styles['dropdown-button']}>
          {mapType}
        </Button>
      </Dropdown>
    </div>
  );
};

export default TopMenuMapType;
