import React, { Fragment } from 'react';
import { BLOCK_PX } from '@/config';
import { MapLength } from '@/map-core/type';
import { isInRange } from '@/utils/coordinate';
import Building from '../building';

const Border = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    version="1.1"
  >
    <path d="M1755 5 L5 1755 L1725 3475 L3475 1725 Z" fill="black" />
  </svg>
);

const BuildingLayer = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: MapLength * BLOCK_PX,
        height: MapLength * BLOCK_PX,
      }}
    >
      <Border />
      {Array.from(Array(MapLength), (_, _r) => {
        return (
          <Fragment key={_r + 1}>
            {Array.from(Array(MapLength), (_, _c) => {
              const [row, col] = [_r + 1, _c + 1];
              if (!isInRange(row, col)) {
                return null;
              }
              const id = `${row}-${col}`;
              return <Building key={id} row={row} col={col} />;
            })}
          </Fragment>
        );
      })}
    </div>
  );
};

export default BuildingLayer;
