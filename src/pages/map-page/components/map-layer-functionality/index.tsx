import React, { FC, memo, useMemo, useState } from 'react';
import { Layer } from 'react-konva';
import { Building as _Building } from '@/map-core/building';
import Building from '../building';
import { MapCore } from '@/map-core';
import { isAllInRange, parseBuildingKey } from '@/utils/coord';
import { canHover, showMarker } from '@/utils/building';
import { useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';
import { OperationType } from '@/map-core/type';

interface MapLayerFunctionalityProps {
  curLi: number;
  curCo: number;
}

const MapLayerFunctionality: FC<MapLayerFunctionalityProps> = (props) => {
  const { curLi, curCo } = props;

  console.log('<MapLayerFunctionality /> rendered');

  const { operation, brush } = useSelector(mapSelector);

  const [previewConfig, setPreviewConfig] = useState({ offLi: 0, offCo: 0 });

  const hoveredBuilding = useMemo(() => {
    if (operation !== OperationType.Empty || !curLi || !curCo) {
      return null;
    }
    const core = MapCore.getInstance();
    const { occupied } = core.cells[curLi][curCo];
    if (!occupied) {
      return null;
    }
    const b = core.buildings[occupied];
    if (!canHover(b)) {
      return null;
    }
    const [line, column] = parseBuildingKey(occupied);
    return { ...b, line, column };
  }, [operation, curLi, curCo]);

  const previewBuilding = useMemo(() => {
    if (operation !== OperationType.PlaceBuilding || !curLi || !curCo) {
      return null;
    }
    const { width, height } = brush;
    const [offLi, offCo] = [Math.floor((height - 1) / 2), Math.floor((width - 1) / 2)];
    if (!isAllInRange(curLi - offLi, curCo - offCo, width - 1, height - 1)) {
      return null;
    }
    setPreviewConfig({ offLi, offCo });
    return brush;
  }, [operation, curLi, curCo, brush]);

  return (
    <Layer name="functionality">
      {hoveredBuilding && <Building {...hoveredBuilding} isHovered={true} />}
      {previewBuilding && (
        <Building
          line={curLi - previewConfig.offLi}
          column={curCo - previewConfig.offCo}
          {...previewBuilding}
        />
      )}
    </Layer>
  );
};

export default memo(MapLayerFunctionality);
