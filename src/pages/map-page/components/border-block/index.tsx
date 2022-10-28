import { BorderStyleType } from '@/map-core/building';
import { UnitPx } from '@/map-core/type';
import React, { FC } from 'react';
import { Group, Line, Rect } from 'react-konva';

interface BorderBlockProps {
  position: 'relative' | 'absolute';
  line?: number;
  column?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  borderColor?: string;
  borderTStyle?: BorderStyleType;
  borderRStyle?: BorderStyleType;
  borderBStyle?: BorderStyleType;
  borderLStyle?: BorderStyleType;
  shadowColor?: string;
  shadowBlur?: number;
  fillPatternImage?: HTMLImageElement;
}

const BorderBlock: FC<BorderBlockProps> = (props) => {
  const {
    position: mode,
    line: li = 0,
    column: co = 0,
    width: w = 1,
    height: h = 1,
    backgroundColor,
    backgroundOpacity = 1,
    borderColor = '#000000',
    borderTStyle = BorderStyleType.Solid,
    borderRStyle = BorderStyleType.Solid,
    borderBStyle = BorderStyleType.Solid,
    borderLStyle = BorderStyleType.Solid,
    shadowColor,
    shadowBlur,
    fillPatternImage,
  } = props;

  const x = mode === 'relative' ? 0 : (co - 1) * UnitPx;
  const y = mode === 'relative' ? 0 : (li - 1) * UnitPx;

  const bw = 1; // borderWidth

  return (
    <Group x={x} y={y}>
      {borderTStyle !== BorderStyleType.None && (
        <Line
          points={[bw, bw / 2, w * UnitPx - bw, bw / 2]}
          dash={borderTStyle === BorderStyleType.Solid ? undefined : [4, 5]}
          stroke={borderColor}
          strokeWidth={bw}
        />
      )}
      {borderRStyle !== BorderStyleType.None && (
        <Line
          points={[w * UnitPx - bw / 2, bw, w * UnitPx - bw / 2, h * UnitPx - bw]}
          dash={borderRStyle === BorderStyleType.Solid ? undefined : [4, 5]}
          stroke={borderColor}
          strokeWidth={bw}
        />
      )}
      {borderBStyle !== BorderStyleType.None && (
        <Line
          points={[bw, h * UnitPx - bw / 2, w * UnitPx - bw, h * UnitPx - bw / 2]}
          dash={borderBStyle === BorderStyleType.Solid ? undefined : [4, 5]}
          stroke={borderColor}
          strokeWidth={bw}
        />
      )}
      {borderLStyle !== BorderStyleType.None && (
        <Line
          points={[bw / 2, bw, bw / 2, h * UnitPx - bw]}
          dash={borderLStyle === BorderStyleType.Solid ? undefined : [4, 5]}
          stroke={borderColor}
          strokeWidth={bw}
        />
      )}
      <Rect
        x={borderLStyle === BorderStyleType.None ? 0 : bw}
        y={borderTStyle === BorderStyleType.None ? 0 : bw}
        width={
          w * UnitPx -
          bw *
            (2 -
              (borderLStyle === BorderStyleType.None ? 1 : 0) -
              (borderRStyle === BorderStyleType.None ? 1 : 0))
        }
        height={
          h * UnitPx -
          bw *
            (2 -
              (borderTStyle === BorderStyleType.None ? 1 : 0) -
              (borderBStyle === BorderStyleType.None ? 1 : 0))
        }
        fill={backgroundColor}
        fillPatternImage={fillPatternImage}
        shadowColor={shadowColor}
        shadowBlur={shadowBlur}
        opacity={backgroundOpacity}
      />
    </Group>
  );
};

export default BorderBlock;
