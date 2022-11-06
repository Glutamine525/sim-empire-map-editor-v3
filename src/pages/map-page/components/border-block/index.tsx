import { BorderStyleType } from '@/map-core/building';
import { UnitPx } from '@/map-core/type';
import React, { FC } from 'react';
import { Group, Line, Rect } from 'react-konva';

interface BorderBlockProps {
  mode: 'relative' | 'absolute' | 'free';
  x?: number;
  y?: number;
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
    mode,
    x: _x = 0,
    y: _y = 0,
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

  const x = mode === 'free' ? _x : mode === 'relative' ? 0 : (co - 1) * UnitPx;
  const y = mode === 'free' ? _y : mode === 'relative' ? 0 : (li - 1) * UnitPx;
  const ratio = mode === 'free' ? 1 : UnitPx;
  const bw = 1; // borderWidth

  return (
    <Group x={x} y={y}>
      {borderTStyle !== BorderStyleType.None && (
        <>
          <Line
            points={[bw, bw / 2, w * ratio - bw, bw / 2]}
            dash={borderTStyle === BorderStyleType.Solid ? undefined : [2, 2]}
            stroke={borderColor}
            strokeWidth={bw}
          />
          {borderTStyle === BorderStyleType.Dashed && (
            <Line
              points={[bw + 2, bw / 2, w * ratio - bw, bw / 2]}
              dash={[2, 2]}
              stroke="white"
              strokeWidth={bw}
            />
          )}
        </>
      )}
      {borderRStyle !== BorderStyleType.None && (
        <>
          <Line
            points={[w * ratio - bw / 2, bw, w * ratio - bw / 2, h * ratio - bw]}
            dash={borderRStyle === BorderStyleType.Solid ? undefined : [2, 2]}
            stroke={borderColor}
            strokeWidth={bw}
          />
          {borderRStyle === BorderStyleType.Dashed && (
            <Line
              points={[w * ratio - bw / 2, bw + 2, w * ratio - bw / 2, h * ratio - bw]}
              dash={[2, 2]}
              stroke="white"
              strokeWidth={bw}
            />
          )}
        </>
      )}
      {borderBStyle !== BorderStyleType.None && (
        <>
          <Line
            points={[bw, h * ratio - bw / 2, w * ratio - bw, h * ratio - bw / 2]}
            dash={borderBStyle === BorderStyleType.Solid ? undefined : [2, 2]}
            stroke={borderColor}
            strokeWidth={bw}
          />
          {borderBStyle === BorderStyleType.Dashed && (
            <Line
              points={[bw + 2, h * ratio - bw / 2, w * ratio - bw, h * ratio - bw / 2]}
              dash={[2, 2]}
              stroke="white"
              strokeWidth={bw}
            />
          )}
        </>
      )}
      {borderLStyle !== BorderStyleType.None && (
        <>
          <Line
            points={[bw / 2, bw, bw / 2, h * ratio - bw]}
            dash={borderLStyle === BorderStyleType.Solid ? undefined : [2, 2]}
            stroke={borderColor}
            strokeWidth={bw}
          />
          {borderLStyle === BorderStyleType.Dashed && (
            <Line
              points={[bw / 2, bw + 2, bw / 2, h * ratio - bw]}
              dash={[2, 2]}
              stroke="white"
              strokeWidth={bw}
            />
          )}
        </>
      )}
      <Rect
        x={borderLStyle === BorderStyleType.None ? 0 : bw}
        y={borderTStyle === BorderStyleType.None ? 0 : bw}
        width={
          w * ratio -
          bw *
            (2 -
              (borderLStyle === BorderStyleType.None ? 1 : 0) -
              (borderRStyle === BorderStyleType.None ? 1 : 0))
        }
        height={
          h * ratio -
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
