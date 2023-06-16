import React, { useMemo } from 'react';
import Content from '@arco-design/web-react/es/Layout/content';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

const Map = () => {
  const buildings = useMemo(() => <BuildingLayer />, []);

  console.log('Chessboard render');

  return (
    <Content className={styles.container}>
      {buildings}
      <InteractLayer />
    </Content>
  );
};

export default Map;
