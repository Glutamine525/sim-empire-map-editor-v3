import React, { createRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { Message } from '@arco-design/web-react';
import Content from '@arco-design/web-react/es/Layout/content';
import PerfectScrollbar from 'perfect-scrollbar';
import { shallow } from 'zustand/shallow';
import { importMapData } from '@/utils/import-export';
import { AUTO_SAVE_INTERVAL } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import { useAutoSave } from '../../_store/auto-save';
import { buildingData, resetBuildingData } from '../../_store/building-data';
import { useMapConfig } from '../../_store/map-config';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

export const mapContainer = createRef<HTMLDivElement>();

const Map = () => {
  console.log('Map render');

  const [
    mapType,
    civil,
    noTree,
    mapRedraw,
    changeCounter,
    changeEmptyCells,
    triggerMapRedraw,
  ] = useMapConfig(
    state => [
      state.mapType,
      state.civil,
      state.noTree,
      state.mapRedraw,
      state.changeCounter,
      state.changeEmptyCells,
      state.triggerMapRedraw,
    ],
    shallow,
  );
  const [mapData, trigger] = useAutoSave(
    state => [state.mapDataStr, state.trigger],
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

    if (mapData) {
      // 用宏任务载入存档，避免被首次mapRedraw重置地图
      setTimeout(() => {
        if (importMapData(mapData)) {
          trigger();
        } else {
          Message.error('存档已损坏');
          triggerMapRedraw();
        }
      }, 0);
    }

    setInterval(() => {
      if (trigger()) {
        Message.success('自动存档');
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      scrollbar.destroy();
    };
  }, []);

  useEffect(() => {
    resetBuildingData();
    mapCore.init(mapType, civil, noTree);
  }, [mapRedraw]);

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
