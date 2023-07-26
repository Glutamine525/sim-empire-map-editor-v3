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
import { BLOCK_PX, UI_SETTING } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import { useMapConfig } from '../../_store/map-config';
import { useSetting } from '../../_store/settings';
import Copyright from '../copyright';
import { mapContainer } from '../map';
import styles from './index.module.css';

export const miniMapCanvas = createRef<HTMLCanvasElement>();

export const MINI_MAP_RATIO = 2;

interface MiniMapProps {
  onMouseEnter: () => void;
}

const MiniMap: FC<MiniMapProps> = props => {
  const { onMouseEnter } = props;

  const mapCore = useMapCore();
  const leftMenuWidth = useMapConfig(state => state.leftMenuWidth);
  const enableMiniMap = useSetting(state => state.enableMiniMap);

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
      ctx.clearRect(
        0,
        0,
        MapLength * MINI_MAP_RATIO,
        MapLength * MINI_MAP_RATIO,
      );
      ctx.fillStyle = 'black';
      for (let i = 0; i <= MapLength; i++) {
        for (let j = 0; j <= MapLength; j++) {
          if (!isBoundary(i, j)) continue;
          ctx.fillRect(
            (j - 1) * MINI_MAP_RATIO,
            (i - 1) * MINI_MAP_RATIO,
            MINI_MAP_RATIO,
            MINI_MAP_RATIO,
          );
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
          (col - 1) * MINI_MAP_RATIO,
          (row - 1) * MINI_MAP_RATIO,
          b.w! * MINI_MAP_RATIO,
          b.h! * MINI_MAP_RATIO,
        );
        return;
      }
      ctx.fillStyle = b.bg!;
      ctx.fillRect(
        (col - 1) * MINI_MAP_RATIO,
        (row - 1) * MINI_MAP_RATIO,
        b.w! * MINI_MAP_RATIO,
        b.h! * MINI_MAP_RATIO,
      );
    };
  }, []);

  const resizer = (leftMenuWidth: number = UI_SETTING.leftMenuWidth) => {
    const { innerWidth, innerHeight } = window;

    setFocusConfig(state => ({
      ...state,
      w: (innerWidth - leftMenuWidth) / BLOCK_PX,
      h: (innerHeight - UI_SETTING.topMenuHeight) / BLOCK_PX,
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

  useEffect(() => {
    resizer();
    const wrappedResizer = () => resizer();
    window.addEventListener('resize', wrappedResizer);
    mapContainer.current?.addEventListener('scroll', scroller);

    return () => {
      window.removeEventListener('resize', wrappedResizer);
      mapContainer.current?.removeEventListener('scroll', scroller);
    };
  }, []);

  useEffect(() => {
    resizer(leftMenuWidth);
  }, [leftMenuWidth]);

  const dragFocus = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    const { top, left } = miniMapCanvas.current!.getBoundingClientRect();
    const [offsetX, offsetY] = [pageX - left, pageY - top];
    const { w, h } = focusConfig;
    mapContainer.current?.scrollTo(
      ((offsetX - (w * MINI_MAP_RATIO) / 2) / (MapLength * MINI_MAP_RATIO)) *
        (MapLength * BLOCK_PX),
      ((offsetY - (h * MINI_MAP_RATIO) / 2) / (MapLength * MINI_MAP_RATIO)) *
        (MapLength * BLOCK_PX),
    );
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        width: MapLength * MINI_MAP_RATIO,
        height: MapLength * MINI_MAP_RATIO,
        display: enableMiniMap ? 'block' : 'none',
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
        width={MapLength * MINI_MAP_RATIO}
        height={MapLength * MINI_MAP_RATIO}
      />
      <Copyright isMiniMap={true} />
      <div
        className={styles.focus}
        style={{
          width: focusConfig.w * MINI_MAP_RATIO,
          height: focusConfig.h * MINI_MAP_RATIO,
          top: focusConfig.top * MINI_MAP_RATIO,
          left: focusConfig.left * MINI_MAP_RATIO,
        }}
      />
    </div>
  );
};

export default MiniMap;
