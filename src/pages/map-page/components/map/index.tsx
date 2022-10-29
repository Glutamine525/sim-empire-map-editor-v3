import { BorderStyleType } from '@/map-core/building';
import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import { isInRange } from '@/utils/coordinate';
import { mapSelector } from '@/store/selectors';
import { createRef, useEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import MapLayerCells from '../map-layer-cells';
import MapLayerFixedBuildings from '../map-layer-fixed-buildings';
import styles from './index.module.less';
import MapLayerFunctionality from '../map-layer-functionality';
import MapLayerBuildings from '../map-layer-buildings';
import KeyboardListener from '../keyboard-listener';
import { MapCore } from '@/map-core';
import { triggerMapUpdater } from '@/store/reducers/map-reducer';
import Konva from 'konva';

export const mapRef = createRef<Konva.Stage>();

const Map = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef({ x: -1, y: -1 });

  const { operation } = useSelector(mapSelector);
  const d = useDispatch();

  const [curCoord, setCurCoord] = useState({ curLi: 0, curCo: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    console.log(performance.now());
  }, []);

  useEffect(() => {
    const scrollbar = Scrollbar.init(wrapperRef.current!, {
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
      <Stage
        ref={mapRef}
        width={MapLength * UnitPx}
        height={MapLength * UnitPx}
        onMouseDown={() => {
          console.log(curCoord);
          setIsDragging(true);
        }}
        onMouseMove={(e) => {
          const {
            evt: { offsetX: x, offsetY: y },
          } = e;
          const column = Math.ceil(x / UnitPx);
          const line = Math.ceil(y / UnitPx);
          !isDragging && setCurCoord({ curLi: line, curCo: column }); // 拖拽时禁止设置当前坐标，防止卡顿
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseLeave={() => {
          setCurCoord({ curLi: 0, curCo: 0 });
          setIsDragging(false);
        }}
        onDblClick={() => {
          if (operation !== OperationType.Empty) {
            return;
          }
          const { curLi, curCo } = curCoord;
          const building = MapCore.getInstance().deleteBuilding(curLi, curCo);
          if (!building) {
            return;
          }
          d(triggerMapUpdater());
        }}>
        <MapLayerCells />
        <MapLayerFixedBuildings />
        <MapLayerBuildings />
        <MapLayerFunctionality {...curCoord} isDragging={isDragging} />
      </Stage>
    </div>
  );
};

export default Map;
