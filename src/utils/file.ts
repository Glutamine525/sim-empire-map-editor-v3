import { MapCore } from '@/map-core';
import { CivilTypeLabel } from '@/map-core/type';
import Konva from 'konva';

export function getFilePostfixName() {
  const now = new Date();
  const fullYear = now.getFullYear().toString();
  const month = now.getMonth() + 1;
  const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
  const randoms = Math.random().toString();
  const numberFileName = fullYear + month + date + randoms.slice(3, 10);
  return numberFileName;
}

export function getMapImageName() {
  const { civil, mapType, noTree } = MapCore.getInstance();
  return `模拟帝国-${CivilTypeLabel[civil]}-${mapType}木-${
    noTree ? '无木' : '有木'
  }-${getFilePostfixName()}.jpg`;
}

export function getImageFromKonvaNode(node: Konva.Node) {
  return new Promise<HTMLImageElement>((resolve) => {
    node.toImage({ pixelRatio: 2, callback: (img) => resolve(img) });
  });
}
