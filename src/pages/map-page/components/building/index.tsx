import { Building as _Building, BorderStyleType } from '@/map-core/building';
import { UnitPx } from '@/map-core/type';
import { RoadImg } from '@/utils/building';
import { getArcoColor } from '@/utils/color';
import React, { FC, memo, useState } from 'react';
import { Group, Line, Rect, Text } from 'react-konva';
import { useDispatch } from 'react-redux';

interface BuildingProps extends _Building {
  line: number;
  column: number;
  showMarker?: boolean;
  isHovered?: boolean;
  fullProtection?: boolean;
  draggable?: boolean;
}

const Building: FC<BuildingProps> = (props) => {
  const {
    line: li,
    column: co,
    width: w,
    height: h,
    backgroundColor,
    text = '',
    textColor = 'black',
    fontSize = 16,
    isRoad = false,
    marker = 0,
    showMarker = true,
    isHovered = false,
    fullProtection = false,
    textShadowColor = 'white',
    borderTStyle = BorderStyleType.Solid,
    borderRStyle = BorderStyleType.Solid,
    borderBStyle = BorderStyleType.Solid,
    borderLStyle = BorderStyleType.Solid,
    draggable = false,
  } = props;

  const x = !isHovered ? (co - 1) * UnitPx : (co - 1 + w / 2) * UnitPx;
  const y = !isHovered ? (li - 1) * UnitPx : (li - 1 + h / 2) * UnitPx;
  const bw = 1; // borderWidth

  const [curCoord, setCurCoord] = useState({ x, y });

  const d = useDispatch();

  console.log('rendered <Building />');

  return (
    <Group
      x={draggable ? curCoord.x : x}
      y={draggable ? curCoord.y : y}
      scale={!isHovered ? undefined : { x: 1.01, y: 1.01 }}
      offset={!isHovered ? undefined : { x: (w * UnitPx) / 2, y: (h * UnitPx) / 2 }}
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
        fillPatternImage={isRoad ? RoadImg : undefined}
        fill={isRoad ? undefined : backgroundColor}
        shadowColor={!isHovered ? undefined : getArcoColor('--gray-5')}
        shadowBlur={!isHovered ? undefined : 10}
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

export default memo(Building);
