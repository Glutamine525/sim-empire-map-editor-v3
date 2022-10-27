import { BorderStyleType } from '@/map-core/building';
import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import { isInRange } from '@/utils/coord';
import { mapSelector } from '@/store/selectors';
import { useEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import Building from '../building';
import MapLayerCells from '../map-layer-cells';
import MapLayerFixedBuildings from '../map-layer-fixed-buildings';
import styles from './index.module.less';
import MapLayerFunctionality from '../map-layer-functionality';

const PerformanceTestBuilding = Array(116)
  .fill(0)
  .map((_, i) => {
    return Array(116)
      .fill(0)
      .map((_, j) => {
        if (!isInRange(i + 1, j + 1)) {
          return null;
        }
        return (
          <Building
            key={`${i}-${j}`}
            line={i + 1}
            column={j + 1}
            width={1}
            height={1}
            backgroundColor="white"
            borderTStyle={BorderStyleType.Dashed}
            borderRStyle={BorderStyleType.Dashed}
            borderBStyle={BorderStyleType.Dashed}
            borderLStyle={BorderStyleType.Dashed}
          />
        );
      });
  });

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef({ x: -1, y: -1 });

  const { operation } = useSelector(mapSelector);

  const [curCoord, setCurCoord] = useState({ line: 0, column: 0 });

  useEffect(() => {
    console.log(performance.now());
  }, []);

  useEffect(() => {
    const scrollbar = Scrollbar.init(mapRef.current!, {
      damping: 0.2,
      alwaysShowTracks: true,
      plugins: {
        draggable: { enabled: operation === OperationType.Empty },
        initPosition: {
          enabled: true,
          initX: scrollOffsetRef.current.x,
          initY: scrollOffsetRef.current.y,
        },
      },
    });
    scrollbar.addListener(({ offset }) => {
      scrollOffsetRef.current = offset;
    });
    return () => {
      Scrollbar.destroy(mapRef.current!);
    };
  }, [operation]);

  return (
    <div ref={mapRef} className={styles.wrapper}>
      <Stage
        width={MapLength * UnitPx}
        height={MapLength * UnitPx}
        onMouseMove={(e) => {
          const {
            evt: { offsetX: x, offsetY: y },
          } = e;
          const column = Math.ceil(x / UnitPx);
          const line = Math.ceil(y / UnitPx);
          setCurCoord({ line, column });
        }}>
        <MapLayerCells />
        <MapLayerFixedBuildings />
        <MapLayerFunctionality curCoord={curCoord} />
      </Stage>
    </div>
  );
};

export default Map;
