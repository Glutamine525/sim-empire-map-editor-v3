import { IS_MAC } from '@/app/editor/_config';
import UAParser from 'ua-parser-js';

let ua = new UAParser();

export function isMac() {
  return ua.getOS().name?.toLowerCase().includes('mac');
}

export function isWindows() {
  return ua.getOS().name?.toLowerCase().includes('windows');
}

export function getCtrlKeyText() {
  if (IS_MAC) {
    return '⌘';
  }
  return 'Ctrl';
}
