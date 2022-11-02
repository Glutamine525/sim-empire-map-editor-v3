import { BorderStyleType } from '@/map-core/building';
import { isInBuildingRange } from '@/utils/coordinate';
import React, { FC, useMemo } from 'react';
import { Group } from 'react-konva';
import BorderBlock from '../border-block';

interface RangeProps {
  line?: number;
  column?: number;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  hidden?: boolean;
}

const Range: FC<RangeProps> = (props) => {
  const {
    line: li = 0,
    column: co = 0,
    size: _s = 0,
    width: w = 0,
    height: h = 0,
    color = '#000000',
    hidden = false,
  } = props;
  const s = Math.max(_s, 4); // size必须>=4

  const cells = useMemo(() => {
    let result: { show: boolean; t: boolean; r: boolean; b: boolean; l: boolean }[][] = [];
    for (let i = 0; i < s * 2 + h; i++) {
      result[i] = [];
      for (let j = 0; j < s * 2 + w; j++) {
        result[i][j] = { show: true, t: true, r: true, b: true, l: true };
        if (isInBuildingRange(i - s, j - s, 0, 0, w, h, s)) {
          if (i - 1 > -1 && result[i - 1][j].show) {
            result[i - 1][j].b = false;
            result[i][j].t = false;
          }
          if (j - 1 > -1 && result[i][j - 1].show) {
            result[i][j - 1].r = false;
            result[i][j].l = false;
          }
        } else result[i][j].show = false;
      }
    }
    return result;
  }, [s, w, h]);

  return (
    <Group visible={!hidden}>
      {cells.map((row, i) =>
        row.map((cell, j) => {
          const { show, t, r, b, l } = cell;
          return (
            <BorderBlock
              key={`${i}-${j}`}
              mode="absolute"
              line={li - s + i}
              column={co - s + j}
              borderColor={show ? color : 'transparent'}
              backgroundColor={show ? color : 'transparent'}
              backgroundOpacity={0.4}
              borderTStyle={t ? BorderStyleType.Solid : BorderStyleType.None}
              borderRStyle={r ? BorderStyleType.Solid : BorderStyleType.None}
              borderBStyle={b ? BorderStyleType.Solid : BorderStyleType.None}
              borderLStyle={l ? BorderStyleType.Solid : BorderStyleType.None}
            />
          );
        }),
      )}
    </Group>
  );
};

export default Range;
