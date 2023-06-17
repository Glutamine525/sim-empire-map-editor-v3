import { MapCore } from '@/map-core';
import { CivilTypeLabel } from '@/map-core/type';

export function stringToBase64(str: string) {
  const encode = encodeURI(str);
  const base64 = window.btoa(encode);
  return base64;
}

export function base64ToString(base64: string) {
  try {
    const decode = window.atob(base64);
    const str = decodeURI(decode);
    return str;
  } catch (e) {
    return '';
  }
}

export function getFilePostfixName() {
  const now = new Date();
  const fullYear = now.getFullYear().toString();
  const month = now.getMonth() + 1;
  const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
  const randoms = Math.random().toString();
  const numberFileName = fullYear + month + date + randoms.slice(3, 10);
  return numberFileName;
}

export function getMapName(ext: string) {
  const { civil, mapType, noTree } = MapCore.getInstance();
  return `模拟帝国-${CivilTypeLabel[civil]}-${mapType}木-${
    noTree ? '无木' : '有木'
  }-${getFilePostfixName()}.${ext}`;
}

export function getMapImageName() {
  return getMapName('jpg');
}

export function getMapDataName() {
  return getMapName('txt');
}

export function download(blob: Blob, fileName: string) {
  const el = document.createElement('a');
  el.setAttribute('href', window.URL.createObjectURL(blob));
  el.setAttribute('download', fileName);
  el.click();
}
