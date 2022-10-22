import React from 'react';
import LeftMenu from './components/left-menu';
import TopMenu from './components/top-menu';
import styles from './index.module.less';

const MapPage = () => {
  return (
    <div className={styles.container}>
      <TopMenu />
      <LeftMenu />
    </div>
  );
};

export default MapPage;
