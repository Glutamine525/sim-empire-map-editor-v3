import React from 'react';
import { Button, Dropdown, Menu } from '@arco-design/web-react';
import { shallow } from 'zustand/shallow';
import { CivilType, CivilTypeLabel } from '@/map-core/type';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

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

const TopMenuCivil = () => {
  console.log('TopMenuCivil render');

  const civil = useMapConfig(state => state.civil);

  return (
    <div>
      <div>文明:</div>
      <Dropdown droplist={CivilDropList()}>
        <Button type="text" className={styles['dropdown-button']}>
          {CivilTypeLabel[civil]}
        </Button>
      </Dropdown>
    </div>
  );
};

export default TopMenuCivil;
