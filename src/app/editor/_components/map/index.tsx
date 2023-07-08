import React, { createRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Content from '@arco-design/web-react/es/Layout/content';
import PerfectScrollbar from 'perfect-scrollbar';
import { shallow } from 'zustand/shallow';
import useMapCore from '../../_hooks/use-map-core';
import { buildingData, resetBuildingData } from '../../_store/building-data';
import { useMapConfig } from '../../_store/map-config';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

export const mapContainer = createRef<HTMLDivElement>();

const Map = () => {
  console.log('Chessboard render');

  const [mapType, civil, noTree, changeCounter, changeEmptyCells] =
    useMapConfig(
      state => [
        state.mapType,
        state.civil,
        state.noTree,
        state.changeCounter,
        state.changeEmptyCells,
      ],
      shallow,
    );

  const mapCore = useMapCore();
  const buildings = useMemo(() => <BuildingLayer />, []);

  useLayoutEffect(() => {
    mapCore.mapUpdater = (key, b) => {
      buildingData[key].set({ ...b });
    };
    mapCore.counterUpdater = changeCounter;
  }, []);

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

  useEffect(() => {
    resetBuildingData();
    mapCore.init(mapType, civil, noTree);
  }, [mapType, civil]);

  useEffect(() => {
    changeEmptyCells(mapCore.emptyCells);
  }, [mapType, noTree]);

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
