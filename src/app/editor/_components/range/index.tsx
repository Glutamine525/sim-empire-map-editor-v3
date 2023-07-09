import React, { FC, memo, useMemo } from 'react';
import { BorderStyleType as BST } from '@/map-core/building/type';
import { hexToRgb } from '@/utils/color';
import { isInBuildingRange } from '@/utils/coordinate';
import Block from '../block';
import styles from './index.module.css';

interface RangeProps {
  row?: number;
  col?: number;
  range?: number;
  w?: number;
  h?: number;
  bg?: string;
  isHidden?: boolean;
}

const Range: FC<RangeProps> = props => {
  const {
    row = 0,
    col = 0,
    range = 0,
    w = 0,
    h = 0,
    bg = '#000000',
    isHidden = true,
  } = props;

  const s = useMemo(() => Math.max(range, 4), [range]);

  const color = useMemo(() => {
    const { r, g, b } = hexToRgb(bg) || { r: 0, g: 0, b: 0 };
    return `rgba(${r},${g},${b},0.4)`;
  }, [bg]);

  const cells = useMemo(() => {
    const result: { show: boolean; t: BST; r: BST; b: BST; l: BST }[][] = [];
    for (let i = 0; i < s * 2 + h; i++) {
      result[i] = [];
      for (let j = 0; j < s * 2 + w; j++) {
        result[i][j] = {
          show: true,
          t: BST.Solid,
          r: BST.Solid,
          b: BST.Solid,
          l: BST.Solid,
        };
        if (isInBuildingRange(i - s, j - s, 0, 0, w, h, s)) {
          if (i - 1 > -1 && result[i - 1][j].show) {
            result[i - 1][j].b = BST.None;
            result[i][j].t = BST.None;
          }
          if (j - 1 > -1 && result[i][j - 1].show) {
            result[i][j - 1].r = BST.None;
            result[i][j].l = BST.None;
          }
        } else result[i][j].show = false;
      }
    }
    return result;
  }, [s, w, h]);

  if (isHidden) {
    return;
  }

  return (
    <div className={styles.container}>
      {cells.map((tmp, i) =>
        tmp.map((cell, j) => {
          const { show, t, r, b, l } = cell;
          if (!show) {
            return null;
          }
          return (
            <Block
              key={`${i}-${j}`}
              row={row - s + i}
              col={col - s + j}
              bg={color}
              borderTStyle={t}
              borderRStyle={r}
              borderBStyle={b}
              borderLStyle={l}
              style={{
                borderColor: color,
              }}
            />
          );
        }),
      )}
    </div>
  );
};

export default memo(Range);
