import { MapCore } from '@/map-core';
import { Building as _Building, BorderStyleType } from '@/map-core/building';
import { UnitPx } from '@/map-core/type';
import { RoadImg, showMarker as _showMarker } from '@/utils/building';
import { getArcoColor } from '@/utils/color';
import React, { FC, useState } from 'react';
import { Circle, Group, Line, Text } from 'react-konva';
import BorderBlock from '../border-block';

interface BuildingProps extends _Building {
  line: number;
  column: number;
  isHovered?: boolean;
  isPreview?: boolean;
  canPlace?: boolean;
  draggable?: boolean;
  hidden?: boolean;
}

const Building: FC<BuildingProps> = (props) => {
  const {
    line: li = 0,
    column: co = 0,
    width: w = 0,
    height: h = 0,
    backgroundColor = 'white',
    text = '',
    textColor = 'black',
    fontSize = 16,
    isRoad = false,
    marker = 0,
    isHovered = false,
    isPreview = false,
    canPlace = true,
    textShadowColor = 'white',
    borderTStyle = BorderStyleType.Solid,
    borderRStyle = BorderStyleType.Solid,
    borderBStyle = BorderStyleType.Solid,
    borderLStyle = BorderStyleType.Solid,
    draggable = false,
    hidden = false,
  } = props;

  const x = !isHovered ? (co - 1) * UnitPx : (co - 1 + w / 2) * UnitPx;
  const y = !isHovered ? (li - 1) * UnitPx : (li - 1 + h / 2) * UnitPx;
  const bw = 1; // borderWidth
  const showMarker = _showMarker(props);

  const [curCoord, setCurCoord] = useState({ x, y });

  return (
    <Group
      x={draggable ? curCoord.x : x}
      y={draggable ? curCoord.y : y}
      scale={!isHovered ? undefined : { x: 1.01, y: 1.01 }}
      offset={!isHovered ? undefined : { x: (w * UnitPx) / 2, y: (h * UnitPx) / 2 }}
      opacity={isPreview ? 0.6 : 1}
      listening={draggable || isHovered || isPreview}
      draggable={draggable}
      visible={!hidden}
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
      <BorderBlock
        position="relative"
        width={w}
        height={h}
        borderColor="rgba(0,0,0,0)"
        backgroundColor={isRoad ? undefined : backgroundColor}
        fillPatternImage={isRoad ? RoadImg : undefined}
        shadowColor={!isHovered ? undefined : getArcoColor('--gray-5')}
        shadowBlur={!isHovered ? undefined : 10}
        borderTStyle={borderTStyle}
        borderRStyle={borderRStyle}
        borderBStyle={borderBStyle}
        borderLStyle={borderLStyle}
      />
      {showMarker &&
        (isRoad ? (
          <Text
            x={bw + 2}
            y={bw + 2}
            fill={
              isRoad
                ? 'black'
                : marker === MapCore.getInstance().protection.length
                ? getArcoColor('--success-6')
                : getArcoColor('--danger-6')
            }
            fontStyle="bold"
            fontSize={10}
            stroke="white"
            strokeWidth={1}
            fillAfterStrokeEnabled={true}
            text={marker.toString()}
          />
        ) : (
          <Circle
            x={5}
            y={5}
            radius={3}
            stroke="white"
            strokeWidth={1}
            fill={
              marker === MapCore.getInstance().protection.length
                ? getArcoColor('--success-6')
                : getArcoColor('--danger-6')
            }
          />
        ))}
      <Text
        x={bw}
        y={bw}
        width={w * UnitPx - bw * 2}
        height={h * UnitPx - bw * 2}
        offsetY={-1}
        text={text}
        fill={textColor}
        fontSize={fontSize}
        stroke={textShadowColor}
        strokeWidth={1}
        fillAfterStrokeEnabled={true}
        ellipsis={true}
        fontStyle="bold"
        align="center"
        verticalAlign="middle"
      />
      {isPreview && !canPlace && (
        <>
          <Line
            points={[bw, bw, w * UnitPx - bw * 2, h * UnitPx - bw * 2]}
            stroke={getArcoColor('--danger-6')}
            strokeWidth={2}
          />
          <Line
            points={[w * UnitPx - bw * 2, bw, bw, h * UnitPx - bw * 2]}
            stroke={getArcoColor('--danger-6')}
            strokeWidth={2}
          />
        </>
      )}
    </Group>
  );
};

export default Building;
