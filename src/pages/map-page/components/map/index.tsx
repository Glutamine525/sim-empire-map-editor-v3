import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import { isInRange } from '@/map-core/util';
import { mapSelector } from '@/store/selectors';
import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import Building from '../building';
import MapLayerCells from '../map-layer-cells';
import styles from './index.module.less';

const PerformanceTestBuilding = Array(116)
  .fill(0)
  .map((_, i) => {
    return Array(116)
      .fill(0)
      .map((_, j) => {
        if (!isInRange(i + 1, j + 1)) {
          return null;
        }
        return <Building key={`${i}-${j}`} li={i + 1} co={j + 1} w={1} h={1} />;
      });
  });

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef({ x: -1, y: -1 });

  const { operation } = useSelector(mapSelector);

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
      <Stage width={MapLength * UnitPx} height={MapLength * UnitPx}>
        <MapLayerCells />
        <Layer name="buildings">
          <Building li={60} co={60} w={1} h={1} />
        </Layer>
      </Stage>
    </div>
  );
};

export default Map;
