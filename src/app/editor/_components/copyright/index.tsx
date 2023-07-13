import React from 'react';
import { shallow } from 'zustand/shallow';
import { VERSION } from '../../_config';
import { CivilTypeLabel } from '../../_map-core/type';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

const Copyright = () => {
  const [civil, mapType, noTree] = useMapConfig(
    state => [state.civil, state.mapType, state.noTree],
    shallow,
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.civil}>{CivilTypeLabel[civil]}</span>
        <span className={styles['map-type']}>{mapType}木</span>
        <span className={styles['no-tree']}>{noTree ? '无木' : '有木'}</span>
        <span className={styles['map-layout']}>地图布局</span>
      </div>
      <div className={styles.author}>
        <span>From the Map Editor</span>
        <strong>V{VERSION}</strong>
        <span>Implemented by</span>
        <strong>Glutamine525</strong>
      </div>
      <div className={styles['web-link']}>
        <div>
          <span>Github:</span>
          <strong>Glutamine525/sim-empire-map-editor-v3</strong>
        </div>
        <div>
          <span>网页链接:</span>
          <strong>simempire.fun</strong>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
