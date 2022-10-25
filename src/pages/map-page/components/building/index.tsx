import { UnitPx } from '@/map-core/type';
import React, { FC, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

interface BuildingProps {
  li: number; // line unit
  co: number; // column unit
  w: number; // width unit
  h: number; // height unit
}

const Building: FC<BuildingProps> = (props) => {
  const { li, co, w, h } = props;

  const bw = Math.min(w, h, 3); // borderWidth

  const [curCoord, setCurCoord] = useState({ x: (co - 1) * UnitPx, y: (li - 1) * UnitPx });

  return (
    <Group
      x={curCoord.x}
      y={curCoord.y}
      draggable={false}
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
      <Rect width={w * UnitPx} height={h * UnitPx} fill="blue" />
      <Rect x={bw} y={bw} width={w * UnitPx - bw * 2} height={h * UnitPx - bw * 2} fill="white" />
      <Text x={bw + 2} y={bw + 2} fill="green" fontSize={10} text="2" />
      <Text
        x={bw}
        y={bw}
        width={w * UnitPx - bw * 2}
        height={h * UnitPx - bw * 2}
        fill="red"
        fontSize={16}
        align="center"
        verticalAlign="middle"
        ellipsis={true}
        text="宅"
      />
    </Group>
  );
};

export default Building;
