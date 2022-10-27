import { MapCore } from '@/map-core';
import { mapSelector } from '@/store/selectors';
import { canHover, showMarker } from '@/utils/building';
import { parseBuildingKey } from '@/utils/coord';
import React, { memo, useMemo } from 'react';
import { Layer } from 'react-konva';
import { useSelector } from 'react-redux';
import Building from '../building';

const MapLayerFixedBuildings = () => {
  const { mapType, noTree } = useSelector(mapSelector);

  const fixedBuildings = useMemo(
    () => Object.entries(MapCore.getInstance().buildings).filter(([_, v]) => v.isFixed),
    [mapType, noTree],
  );

  return (
    <Layer name="fix-buildings">
      {fixedBuildings.map(([key, b]) => {
        const [line, column] = parseBuildingKey(key);
        return <Building key={key} line={line} column={column} {...b} />;
      })}
    </Layer>
  );
};

export default memo(MapLayerFixedBuildings);
