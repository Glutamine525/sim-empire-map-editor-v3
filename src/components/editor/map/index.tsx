import React, { useMemo } from 'react';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

const Map = () => {
  const buildings = useMemo(() => <BuildingLayer />, []);

  console.log('Chessboard render');

  return (
    <div
      className={styles.wrapper}
      style={{
        paddingTop: EDITOR_PAGE_UI_SETTING.topMenuHeight,
        paddingLeft: EDITOR_PAGE_UI_SETTING.leftMenuWidth,
      }}
    >
      <div className={styles.container}>
        {buildings}
        <InteractLayer />
      </div>
    </div>
  );
};

export default Map;
