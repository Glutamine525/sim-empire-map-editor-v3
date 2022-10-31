import { MapCore } from '@/map-core';
import { mapSelector } from '@/store/selectors';
import { parseBuildingKey } from '@/utils/coordinate';
import React, { memo, useMemo } from 'react';
import { Layer } from 'react-konva';
import { useSelector } from 'react-redux';
import Building from '../building';

const MapLayerBarrier = () => {
  const { mapType, noTree } = useSelector(mapSelector);

  const barriers = useMemo(
    () => Object.entries(MapCore.getInstance().buildings).filter(([_, v]) => v.isBarrier),
    [mapType, noTree],
  );

  return (
    <Layer name="fix-buildings" listening={false}>
      {barriers.map(([key, b]) => {
        const [line, column] = parseBuildingKey(key);
        return <Building key={key} line={line} column={column} {...b} />;
      })}
    </Layer>
  );
};

export default memo(MapLayerBarrier);
