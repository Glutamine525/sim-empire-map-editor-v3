import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import { mapSelector } from '@/store/selectors';
import { createRef, useEffect, useRef } from 'react';
import { Stage } from 'react-konva';
import { useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import MapLayerCells from '../map-layer-cells';
import MapLayerBarrier from '../map-layer-barrier';
import styles from './index.module.less';
import MapLayerFunctionality from '../map-layer-functionality';
import MapLayerBuildings from '../map-layer-buildings';
import KeyboardListener from '../keyboard-listener';
import Konva from 'konva';

let scrollbar: Scrollbar;

export function getMapScrollbar() {
  return scrollbar;
}

export const mapRef = createRef<Konva.Stage>();

const Map = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef({ x: -1, y: -1 });

  const { operation } = useSelector(mapSelector);

  useEffect(() => {
    console.log(performance.now());
  }, []);

  useEffect(() => {
    scrollbar = Scrollbar.init(wrapperRef.current!, {
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
      Scrollbar.destroy(wrapperRef.current!);
    };
  }, [operation]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <KeyboardListener />
      <Stage ref={mapRef} width={MapLength * UnitPx} height={MapLength * UnitPx}>
        <MapLayerCells />
        <MapLayerBarrier />
        <MapLayerBuildings />
        <MapLayerFunctionality />
      </Stage>
    </div>
  );
};

export default Map;
