import React, { useEffect, useMemo } from 'react';
import { Group, Layer, Transformer } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import { useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';
import { MapCore } from '@/map-core';
import { getBuildingKey } from '@/utils/coord';
import { showMarker } from '@/utils/building';

const MapLayerFunctionality = () => {
  const { hoveredCoord } = useSelector(mapSelector);

  const hoveredBuilding = useMemo(() => {
    const { line, column } = hoveredCoord;
    if (!line || !column) {
      return null;
    }
    return MapCore.getInstance().buildings[getBuildingKey(line, column)];
  }, [hoveredCoord]);

  return (
    <Layer name="functionality">
      {hoveredBuilding && (
        <Group>
          <Building
            key="hoveredBuilding"
            line={hoveredCoord.line}
            column={hoveredCoord.column}
            {...hoveredBuilding}
            showMarker={showMarker(hoveredBuilding)}
            canHover={false}
          />
        </Group>
      )}
    </Layer>
  );
};

export default MapLayerFunctionality;
