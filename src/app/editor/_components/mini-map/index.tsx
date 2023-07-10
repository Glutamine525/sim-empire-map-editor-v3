import React, {
  createRef,
  FC,
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { MapLength } from '@/app/editor/_map-core/type';
import { isBoundary, parseBuildingKey } from '@/utils/coordinate';
import { BLOCK_PX } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import { mapContainer } from '../map';
import styles from './index.module.css';

export const miniMapCanvas = createRef<HTMLCanvasElement>();

const RATIO = 2;

interface MiniMapProps {
  onMouseEnter: () => void;
}

const MiniMap: FC<MiniMapProps> = props => {
  const { onMouseEnter } = props;

  const mapCore = useMapCore();

  const isMouseDown = useRef(false);

  const [focusConfig, setFocusConfig] = useState({
    w: 0,
    h: 0,
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    mapCore.miniMapResetter = () => {
      const ctx = miniMapCanvas.current?.getContext('2d');
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, MapLength * RATIO, MapLength * RATIO);
      ctx.fillStyle = 'black';
      for (let i = 0; i <= MapLength; i++) {
        for (let j = 0; j <= MapLength; j++) {
          if (!isBoundary(i, j)) continue;
          ctx.fillRect((j - 1) * RATIO, (i - 1) * RATIO, RATIO, RATIO);
        }
      }
    };
    mapCore.miniMapUpdater = (key, b) => {
      const ctx = miniMapCanvas.current?.getContext('2d')!;
      if (!ctx) {
        return;
      }
      const [row, col] = parseBuildingKey(key);
      if (b.isEmpty) {
        ctx.clearRect(
          (col - 1) * RATIO,
          (row - 1) * RATIO,
          b.w! * RATIO,
          b.h! * RATIO,
        );
        return;
      }
      ctx.fillStyle = b.bg!;
      ctx.fillRect(
        (col - 1) * RATIO,
        (row - 1) * RATIO,
        b.w! * RATIO,
        b.h! * RATIO,
      );
    };
  }, []);

  useEffect(() => {
    const resizer = () => {
      const { width, height } = mapContainer.current!.getBoundingClientRect();
      setFocusConfig(state => ({
        ...state,
        w: width / BLOCK_PX,
        h: height / BLOCK_PX,
      }));
      scroller();
    };

    const scroller = () => {
      const { scrollTop, scrollLeft } = mapContainer.current!;
      setFocusConfig(state => ({
        ...state,
        top: scrollTop / BLOCK_PX,
        left: scrollLeft / BLOCK_PX,
      }));
    };

    resizer();
    window.addEventListener('resize', resizer);
    mapContainer.current?.addEventListener('scroll', scroller);

    return () => {
      window.removeEventListener('resize', resizer);
      mapContainer.current?.removeEventListener('scroll', scroller);
    };
  }, []);

  const dragFocus = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const { top, left } = miniMapCanvas.current!.getBoundingClientRect();
    const [offsetX, offsetY] = [pageX - left, pageY - top];
    const { w, h } = focusConfig;
    mapContainer.current?.scrollTo(
      ((offsetX - (w * RATIO) / 2) / (MapLength * RATIO)) *
        (MapLength * BLOCK_PX),
      ((offsetY - (h * RATIO) / 2) / (MapLength * RATIO)) *
        (MapLength * BLOCK_PX),
    );
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        width: MapLength * RATIO,
        height: MapLength * RATIO,
      }}
      onMouseDownCapture={e => {
        e.stopPropagation();
        isMouseDown.current = true;
        dragFocus(e);
      }}
      onMouseMoveCapture={e => {
        e.stopPropagation();
        if (!isMouseDown.current) {
          return;
        }
        dragFocus(e);
      }}
      onMouseUpCapture={e => {
        e.stopPropagation();
        isMouseDown.current = false;
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        isMouseDown.current = false;
      }}
    >
      <canvas
        ref={miniMapCanvas}
        className={styles.container}
        width={MapLength * RATIO}
        height={MapLength * RATIO}
      />
      <div
        className={styles.focus}
        style={{
          width: focusConfig.w * RATIO,
          height: focusConfig.h * RATIO,
          top: focusConfig.top * RATIO,
          left: focusConfig.left * RATIO,
        }}
      />
    </div>
  );
};

export default MiniMap;
