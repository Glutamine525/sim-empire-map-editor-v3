import React, { FC, useMemo } from 'react';
import { Layer } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import { MapCore } from '@/map-core';
import { parseBuildingKey } from '@/utils/coord';
import { canHover, showMarker } from '@/utils/building';

interface MapLayerFunctionalityProps {
  curCoord: { line: number; column: number };
}

const MapLayerFunctionality: FC<MapLayerFunctionalityProps> = (props) => {
  const {
    curCoord: { line, column },
  } = props;

  const hoveredBuilding = useMemo(() => {
    if (!line || !column) {
      return null;
    }
    const core = MapCore.getInstance();
    const { occupied } = core.cells[line][column];
    if (!occupied) {
      return null;
    }
    const b = core.buildings[occupied];
    if (!canHover(b)) {
      return null;
    }
    const [realLi, realCo] = parseBuildingKey(occupied);
    return { ...b, line: realLi, column: realCo };
  }, [line, column]);

  return (
    <Layer name="functionality">
      {hoveredBuilding && (
        <Building {...hoveredBuilding} showMarker={showMarker(hoveredBuilding)} isHovered={true} />
      )}
    </Layer>
  );
};

export default MapLayerFunctionality;
