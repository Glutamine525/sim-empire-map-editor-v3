import { MapCore } from '@/map-core';
import { UnitPx } from '@/map-core/type';
import { parseBuildingKey } from '@/utils/coordinate';
import { getImageFromKonvaNode } from '@/utils/file';
import { clear } from 'console';
import Konva from 'konva';
import { layerRef } from '.';

export async function drawBuildings(line: number, column: number, data: HTMLImageElement) {
  const shape = new Konva.Image({
    x: (column - 1) * UnitPx,
    y: (line - 1) * UnitPx,
    scale: { x: 0.5, y: 0.5 },
    image: data,
  });
  layerRef.current?.add(shape);
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
    const clearer = new Konva.Shape({
      sceneFunc: (ctx, shape) => {
        ctx.clearRect(
          (column - 1) * UnitPx,
          (line - 1) * UnitPx,
          b.width * UnitPx,
          b.height * UnitPx,
        );
        ctx.fillStrokeShape(shape);
      },
    });
    layerRef.current?.add(clearer);
    core.deleteBuilding(line, column);
  }
}
