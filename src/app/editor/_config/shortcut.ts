import { CatalogType } from '@/app/editor/_map-core/building/type';

export const mapShortcutToMenu: { [key: string]: CatalogType } = {
  A: CatalogType.Road,
  Q: CatalogType.Residence,
  W: CatalogType.Agriculture,
  E: CatalogType.Industry,
  R: CatalogType.Commerce,
  T: CatalogType.Municipal,
  Y: CatalogType.Culture,
  U: CatalogType.Religion,
  I: CatalogType.Military,
  O: CatalogType.Decoration,
  P: CatalogType.Wonder,
  G: CatalogType.General,
  F: CatalogType.Special,
  Space: CatalogType.Cancel,
  S: CatalogType.Move,
  D: CatalogType.Delete,
  N: CatalogType.Undo,
  M: CatalogType.Redo,
  L: CatalogType.WatermarkMode,
  H: CatalogType.ImportExport,
};

export const mapMenuToShortcut: { [key in CatalogType]: string } = {
  [CatalogType.Road]: 'A',
  [CatalogType.Residence]: 'Q',
  [CatalogType.Agriculture]: 'W',
  [CatalogType.Industry]: 'E',
  [CatalogType.Commerce]: 'R',
  [CatalogType.Municipal]: 'T',
  [CatalogType.Culture]: 'Y',
  [CatalogType.Religion]: 'U',
  [CatalogType.Military]: 'I',
  [CatalogType.Decoration]: 'O',
  [CatalogType.Wonder]: 'P',
  [CatalogType.General]: 'G',
  [CatalogType.Special]: 'F',
  [CatalogType.Cancel]: 'Space',
  [CatalogType.Move]: 'S',
  [CatalogType.Delete]: 'D',
  [CatalogType.Undo]: 'N',
  [CatalogType.Redo]: 'M',
  [CatalogType.WatermarkMode]: 'L',
  [CatalogType.ImportExport]: 'H',
};

export const mapShortcutToIdx: { [key: string]: number } = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '0': 9,
  '-': 10,
  '=': 11,
  '[': 12,
  ']': 13,
  ';': 14,
  "'": 15,
  ',': 16,
  '.': 17,
  '/': 18,
};

export const ahooksIdxKeyFilter = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'dash',
  'equalsign',
  'openbracket',
  'closebracket',
  'semicolon',
  'singlequote',
  'comma',
  'period',
  'forwardslash',
];

export const mapIdxToShortcut: { [key: number]: string } = {
  0: '1',
  1: '2',
  2: '3',
  3: '4',
  4: '5',
  5: '6',
  6: '7',
  7: '8',
  8: '9',
  9: '0',
  10: '-',
  11: '=',
  12: '[',
  13: ']',
  14: ';',
  15: "'",
  16: ',',
  17: '.',
  18: '/',
};

export const shortcutIdxCap = Object.keys(mapShortcutToIdx).length;

export const protectionShortcut = ['Z', 'X', 'C', 'V', 'B'];

export const mapProtectionShortcutToIdx: { [key: string]: number } = {
  Z: 0,
  X: 1,
  C: 2,
  V: 3,
  B: 4,
};
