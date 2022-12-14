import { MapCore } from '@/map-core';
import { MapLength, UnitPx } from '@/map-core/type';
import { parseBuildingKey } from '@/utils/coordinate';
import { getImageFromKonvaNode } from '@/utils/file';
import Konva from 'konva';
import { layerRef } from '.';

export async function drawBuildings(line: number, column: number, data: HTMLImageElement) {
  layerRef.current?.add(
    new Konva.Image({
      x: (column - 1) * UnitPx,
      y: (line - 1) * UnitPx,
      scale: { x: 0.5, y: 0.5 },
      image: data,
    }),
  );
}

export async function cacheBuildings() {
  const cache = await getImageFromKonvaNode(layerRef.current!);
  layerRef.current!.destroyChildren();
  layerRef.current?.add(
    new Konva.Image({
      scale: { x: 0.5, y: 0.5 },
      image: cache,
    }),
  );
}

export function removeBuildings(keys: string[]) {
  const core = MapCore.getInstance();
  for (let key of keys) {
    const [_line, _column] = parseBuildingKey(key);
    const [line, column] = parseBuildingKey(core.cells[_line][_column].occupied);
    const b = core.getBuilding(key)!;
    layerRef.current?.add(
      new Konva.Shape({
        sceneFunc: (ctx, shape) => {
          ctx.clearRect(
            (column - 1) * UnitPx,
            (line - 1) * UnitPx,
            b.width * UnitPx + 0.5,
            b.height * UnitPx + 0.5,
          );
          ctx.fillStrokeShape(shape);
        },
      }),
    );
    core.deleteBuilding(line, column);
  }
}

export function clearBuildingLayer() {
  layerRef.current?.destroyChildren();
  layerRef.current?.add(
    new Konva.Shape({
      sceneFunc: (ctx, shape) => {
        ctx.clearRect(0, 0, MapLength * UnitPx, MapLength * UnitPx);
        ctx.fillStrokeShape(shape);
      },
    }),
  );
}
