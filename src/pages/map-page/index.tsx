import React from 'react';
import LeftMenu from './components/left-menu';
import TopMenu from './components/top-menu';
import Map from './components/map';
import styles from './index.module.less';
import MiniMap from './components/mini-map';

const MapPage = () => {
  return (
    <div className={styles.container}>
      <Map />
      <MiniMap />
      <TopMenu />
      <LeftMenu />
    </div>
  );
};

export default MapPage;
