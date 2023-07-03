import React, { createRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Content from '@arco-design/web-react/es/Layout/content';
import PerfectScrollbar from 'perfect-scrollbar';
import { shallow } from 'zustand/shallow';
import { MapCore } from '@/map-core';
import { buildingData } from '../../_store/building-data';
import { useMapConfig } from '../../_store/map-config';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

export const mapContainer = createRef<HTMLDivElement>();

const Map = () => {
  console.log('Chessboard render');

  const [mapType, civil, noTree] = useMapConfig(
    state => [state.mapType, state.civil, state.noTree],
    shallow,
  );

  const mapCore = useMemo(() => MapCore.getInstance(), []);
  const buildings = useMemo(() => <BuildingLayer />, []);

  useLayoutEffect(() => {
    mapCore.mapUpdater = (key, b) => {
      buildingData[key].set(b);
    };
  });

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
    mapCore.init(mapType, civil, noTree);

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return (
    <Content className={styles.wrapper}>
      <div ref={mapContainer} className={styles.container}>
        {buildings}
        <InteractLayer />
      </div>
    </Content>
  );
};

export default Map;
