import React, { createRef, useEffect, useMemo } from 'react';
import Content from '@arco-design/web-react/es/Layout/content';
import PerfectScrollbar from 'perfect-scrollbar';
import { BLOCK_PX } from '@/config';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

export const mapContainer = createRef<HTMLDivElement>();

const Map = () => {
  const buildings = useMemo(() => <BuildingLayer />, []);

  console.log('Chessboard render');

  useEffect(() => {
    const scrollbar = new PerfectScrollbar(mapContainer.current!, {
      wheelPropagation: true,
    });
    const { scrollHeight, scrollWidth, clientWidth, clientHeight } =
      mapContainer.current!;
    mapContainer.current!.scrollTo(
      (scrollWidth - clientWidth) / 2,
      (scrollHeight - clientHeight) / 2,
    );

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return (
    <Content className={styles.wrapper}>
      <div
        ref={mapContainer}
        className={styles.container}
        style={{ padding: BLOCK_PX }}
      >
        {buildings}
        <InteractLayer />
      </div>
    </Content>
  );
};

export default Map;
