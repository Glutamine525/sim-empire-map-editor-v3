import { MapCore } from '@/map-core';
import { MapLength, MiniMapDisplayRatio, MiniMapRatio, UnitPx } from '@/map-core/type';
import { mapSelector, settingSelector } from '@/store/selectors';
import { getColors } from '@/utils/color';
import { isInRange } from '@/utils/coordinate';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollListener } from 'smooth-scrollbar/interfaces';
import { getMapScrollbar } from '../map';
import styles from './index.module.less';
import { initMiniMap } from './render';

const miniMapRef = createRef<HTMLCanvasElement>();

export const getMiniMapContext = () => {
  const canvas = miniMapRef.current!;
  if (!canvas) {
    return null;
  }
  return canvas.getContext('2d')!;
};

const MiniMap = () => {
  const { theme } = useSelector(settingSelector);
  const { mapType, civil, operation } = useSelector(mapSelector);

  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [windowPos, setWindowPos] = useState({ top: 0, left: 0 });

  const core = useMemo(() => MapCore.getInstance(), []);

  useEffect(() => {
    const onResize = () => {
      const { innerWidth, innerHeight } = window;
      setWindowSize({
        width: ((innerWidth - 180 - 60) / UnitPx) * MiniMapDisplayRatio,
        height: ((innerHeight - 60 - 60) / UnitPx) * MiniMapDisplayRatio,
      });
    };
    const onScroll: ScrollListener = ({ offset: { x, y } }) => {
      setWindowPos({
        top: (y / UnitPx) * MiniMapDisplayRatio,
        left: (x / UnitPx) * MiniMapDisplayRatio,
      });
    };
    onResize();
    window.addEventListener('resize', onResize);
    const scrollbar = getMapScrollbar();
    scrollbar.addListener(onScroll);
    setWindowPos({
      top: (scrollbar.scrollTop / UnitPx) * MiniMapDisplayRatio,
      left: (scrollbar.scrollLeft / UnitPx) * MiniMapDisplayRatio,
    });
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [operation]);

  useEffect(() => {
    initMiniMap();
  }, []);

  useEffect(() => {
    const canvas = miniMapRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = getColors(theme).backgroundInnerColor;
    for (let line = 1; line <= MapLength; line++) {
      for (let column = 1; column <= MapLength; column++) {
        if (!isInRange(line, column)) continue;
        if (core.cells[line][column].occupied) continue;
        ctx.fillRect(
          (column - 1) * MiniMapRatio,
          (line - 1) * MiniMapRatio,
          MiniMapRatio,
          MiniMapRatio,
        );
      }
    }
  }, [theme]);

  return (
    <div
      className={styles.wrapper}
      style={{ width: MapLength * MiniMapDisplayRatio, height: MapLength * MiniMapDisplayRatio }}>
      <div
        className={styles.container}
        style={{ width: MapLength * MiniMapDisplayRatio, height: MapLength * MiniMapDisplayRatio }}
        onMouseDownCapture={(e) => {
          const {
            nativeEvent: { offsetX, offsetY },
          } = e;
          setIsDragging(true);
          getMapScrollbar().scrollTo(
            ((offsetX - windowSize.width / 2) / MiniMapDisplayRatio) * UnitPx,
            ((offsetY - windowSize.height / 2) / MiniMapDisplayRatio) * UnitPx,
          );
        }}
        onMouseMoveCapture={(e) => {
          if (!isDragging) {
            return;
          }
          const {
            nativeEvent: { offsetX, offsetY },
          } = e;
          getMapScrollbar().scrollTo(
            ((offsetX - windowSize.width / 2) / MiniMapDisplayRatio) * UnitPx,
            ((offsetY - windowSize.height / 2) / MiniMapDisplayRatio) * UnitPx,
          );
        }}
        onMouseUpCapture={() => {
          setIsDragging(false);
        }}
        onMouseLeave={() => {
          setIsDragging(false);
        }}>
        <canvas
          ref={miniMapRef}
          className={styles.canvas}
          width={MapLength * MiniMapRatio}
          height={MapLength * MiniMapRatio}
        />
        <div
          className={styles.window}
          style={{
            width: windowSize.width,
            height: windowSize.height,
            top: windowPos.top,
            left: windowPos.left,
          }}
        />
      </div>
    </div>
  );
};

export default MiniMap;
