import { OperationType } from '@/map-core/type';
import { mapSelector } from '@/store/selectors';
import { useEffect, useRef } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import styles from './index.module.less';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef({ x: -1, y: -1 });

  const { operation } = useSelector(mapSelector);

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
      <Stage width={3480} height={3480}>
        <Layer>
          {/* {Array(115)
            .fill(0)
            .map((_, i) => {
              return Array(115)
                .fill(0)
                .map((_, j) => <Circle key={j} x={i * 30} y={j * 30} radius={15} fill="#313132" />);
            })} */}
        </Layer>
      </Stage>
    </div>
  );
};

export default Map;
