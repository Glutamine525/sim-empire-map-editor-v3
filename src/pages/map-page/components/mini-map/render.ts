import { MapLength, MiniMapRatio } from '@/map-core/type';
import store from '@/store';
import { getColors } from '@/utils/color';
import { isInRange } from '@/utils/coordinate';
import { getMiniMapContext } from '.';

export function initMiniMap() {
  const ctx = getMiniMapContext();
  if (!ctx) {
    return;
  }
  const half = MapLength / 2;
  ctx.clearRect(0, 0, MapLength * MiniMapRatio, MapLength * MiniMapRatio);
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(0, half * MiniMapRatio + 1);
  ctx.lineTo(half * MiniMapRatio + 1, 0);
  ctx.lineTo(half * MiniMapRatio + MiniMapRatio, 0);
  ctx.lineTo(MapLength * MiniMapRatio, (half - 1) * MiniMapRatio + 1);
  ctx.lineTo(MapLength * MiniMapRatio, (half - 1) * MiniMapRatio + MiniMapRatio);
  ctx.lineTo((half - 1) * MiniMapRatio + MiniMapRatio, MapLength * MiniMapRatio);
  ctx.lineTo((half - 1) * MiniMapRatio + 1, MapLength * MiniMapRatio);
  ctx.lineTo(0, half * MiniMapRatio + MiniMapRatio);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = getColors(store.getState().setting.theme).backgroundInnerColor;
  for (let line = 1; line <= MapLength; line++) {
    for (let column = 1; column <= MapLength; column++) {
      if (!isInRange(line, column)) continue;
      ctx.fillRect(
        (column - 1) * MiniMapRatio,
        (line - 1) * MiniMapRatio,
        MiniMapRatio,
        MiniMapRatio,
      );
    }
  }
}

export function placeBuildingOnMiniMap(config: {
  line: number;
  column: number;
  width: number;
  height: number;
  backgroundColor: string;
}) {
  const { line, column, width, height, backgroundColor } = config;
  const ctx = getMiniMapContext();
  if (!ctx) {
    return;
  }
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(
    (column - 1) * MiniMapRatio,
    (line - 1) * MiniMapRatio,
    width * MiniMapRatio,
    height * MiniMapRatio,
  );
}

export function deleteBuildingOnMiniMap(config: {
  line: number;
  column: number;
  width: number;
  height: number;
}) {
  const { line, column, width, height } = config;
  const ctx = getMiniMapContext();
  if (!ctx) {
    return;
  }
  ctx.fillStyle = getColors(store.getState().setting.theme).backgroundInnerColor;
  ctx.fillRect(
    (column - 1) * MiniMapRatio,
    (line - 1) * MiniMapRatio,
    width * MiniMapRatio,
    height * MiniMapRatio,
  );
}
