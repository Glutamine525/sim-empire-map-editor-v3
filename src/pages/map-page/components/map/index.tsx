import { BorderStyleType } from '@/map-core/building';
import { MapLength, OperationType, UnitPx } from '@/map-core/type';
import { isInRange } from '@/utils/coord';
import { mapSelector } from '@/store/selectors';
import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import Building from '../building';
import MapLayerCells from '../map-layer-cells';
import MapLayerFixedBuildings from '../map-layer-fixed-buildings';
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
        return (
          <Building
            key={`${i}-${j}`}
            line={i + 1}
            column={j + 1}
            width={1}
            height={1}
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
        <MapLayerFixedBuildings />
        <Layer name="buildings">
          {/* <Building
            line={60}
            column={60}
            width={2}
            height={2}
            text="哈哈"
            backgroundColor="red"
            borderBStyle={BorderStyleType.Dashed}
            borderRStyle={BorderStyleType.Dashed}
          />
          <Building
            line={62}
            column={60}
            width={2}
            height={2}
            text="哈哈"
            backgroundColor="red"
            borderTStyle={BorderStyleType.Dashed}
            borderRStyle={BorderStyleType.Dashed}
          />
          <Building
            line={60}
            column={62}
            width={2}
            height={2}
            text="哈哈"
            backgroundColor="red"
            borderLStyle={BorderStyleType.Dashed}
            borderBStyle={BorderStyleType.Dashed}
          />
          <Building line={62} column={62} width={2} height={2} text="哈哈" backgroundColor="red"
            borderTStyle={BorderStyleType.Dashed}
            borderLStyle={BorderStyleType.Dashed} /> */}
          {/* {PerformanceTestBuilding} */}
        </Layer>
      </Stage>
    </div>
  );
};

export default Map;
