import { MapCore } from '@/map-core';
import { mapSelector } from '@/store/selectors';
import { parseBuildingKey } from '@/utils/coord';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Layer } from 'react-konva';
import Konva from 'konva';
import { useSelector } from 'react-redux';
import Building from '../building';

const MapLayerBuildings = () => {
  const { mapType, noTree, mapUpdater } = useSelector(mapSelector);

  // console.log('<MapLayerBuildings /> rendered');

  const layerRef = useRef<Konva.Layer>(null);

  const buildings = useMemo(
    () => Object.entries(MapCore.getInstance().buildings).filter(([_, v]) => !v.isFixed),
    [mapType, noTree, mapUpdater],
  );

  useEffect(() => {
    layerRef.current?.on('draw', () => {
      console.log('draw finished');
    });
  }, []);

  return (
    <Layer name="buildings" ref={layerRef}>
      {buildings.map(([key, b]) => {
        const [line, column] = parseBuildingKey(key);
        return <Building key={key} line={line} column={column} {...b} />;
      })}
    </Layer>
  );
};

export default memo(MapLayerBuildings);
