import { BorderStyleType } from '@/map-core/building';
import { UnitPx } from '@/map-core/type';
import { getArcoColor } from '@/utils/color';
import React, { FC, useState } from 'react';
import { Group, Line, Rect, Text } from 'react-konva';

interface BuildingProps {
  line: number;
  column: number;
  width: number;
  height: number;
  text?: string;
  textColor?: string;
  fontSize?: number;
  backgroundColor?: string;
  isRoad?: boolean;
  marker?: number;
  showMarker?: boolean;
  fullProtection?: boolean;
  textShadowColor?: string;
  borderTStyle?: BorderStyleType;
  borderRStyle?: BorderStyleType;
  borderBStyle?: BorderStyleType;
  borderLStyle?: BorderStyleType;
  draggable?: boolean;
}

const Building: FC<BuildingProps> = (props) => {
  const {
    line: li,
    column: co,
    width: w,
    height: h,
    text = '',
    textColor = 'black',
    fontSize = 16,
    backgroundColor = 'white',
    isRoad = false,
    marker = 0,
    showMarker = true,
    fullProtection = false,
    textShadowColor = 'white',
    borderTStyle = BorderStyleType.Solid,
    borderRStyle = BorderStyleType.Solid,
    borderBStyle = BorderStyleType.Solid,
    borderLStyle = BorderStyleType.Solid,
    draggable = false,
  } = props;

  const bw = 1; // borderWidth

  const [curCoord, setCurCoord] = useState({ x: (co - 1) * UnitPx, y: (li - 1) * UnitPx });

  return (
    <Group
      x={curCoord.x}
      y={curCoord.y}
      draggable={draggable}
      onDragMove={({ target }) => {
        setCurCoord({
          x: target.x(),
          y: target.y(),
        });
      }}
      onDragEnd={({ target }) => {
        const x = target.x();
        const y = target.y();
        const offsetCo = x % UnitPx < 15 ? 0 : 1;
        const offsetLi = y % UnitPx < 15 ? 0 : 1;
        setCurCoord({
          x: (Math.floor(x / UnitPx) + offsetCo) * UnitPx,
          y: (Math.floor(y / UnitPx) + offsetLi) * UnitPx,
        });
      }}>
      {borderTStyle === BorderStyleType.Dashed && (
        <Line
          points={[bw, 0.5, w * UnitPx - bw, 0.5]}
          dash={[4, 5]}
          stroke={backgroundColor}
          strokeWidth={1}
        />
      )}
      {borderRStyle === BorderStyleType.Dashed && (
        <Line
          points={[w * UnitPx - 0.5, bw, w * UnitPx - 0.5, h * UnitPx - bw]}
          dash={[4, 5]}
          stroke={backgroundColor}
          strokeWidth={1}
        />
      )}
      {borderBStyle === BorderStyleType.Dashed && (
        <Line
          points={[bw, h * UnitPx - 0.5, w * UnitPx - bw, h * UnitPx - 0.5]}
          dash={[4, 5]}
          stroke={backgroundColor}
          strokeWidth={1}
        />
      )}
      {borderLStyle === BorderStyleType.Dashed && (
        <Line
          points={[0.5, bw, 0.5, h * UnitPx - bw]}
          dash={[4, 5]}
          stroke={backgroundColor}
          strokeWidth={1}
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
      />
      {showMarker && (
        <Text
          x={bw + 2}
          y={bw + 2}
          fill={
            isRoad
              ? 'black'
              : fullProtection
              ? getArcoColor('--success-6')
              : getArcoColor('--danger-6')
          }
          fontStyle="bold"
          fontSize={9}
          shadowColor="white"
          shadowBlur={4}
          text={marker.toString()}
        />
      )}
      <Text
        x={bw}
        y={bw}
        width={w * UnitPx - bw * 2}
        height={h * UnitPx - bw * 2}
        offsetY={-1}
        text={text}
        fill={textColor}
        fontSize={fontSize}
        shadowColor={textShadowColor}
        shadowBlur={5}
        ellipsis={true}
        fontStyle="bold"
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
};

export default Building;
