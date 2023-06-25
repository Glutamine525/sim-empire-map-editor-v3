import React, { Fragment } from 'react';
import { BLOCK_PX } from '@/config';
import { MapLength } from '@/map-core/type';
import Building from '../building';

const BuildingLayer = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: MapLength * BLOCK_PX,
        height: MapLength * BLOCK_PX,
      }}
    >
      {Array.from(Array(MapLength), (_, row) => {
        return (
          <Fragment key={row + 1}>
            {Array.from(Array(MapLength), (_, col) => {
              const id = `${row + 1}-${col + 1}`;
              return <Building key={id} row={row + 1} col={col + 1} />;
            })}
          </Fragment>
        );
      })}
    </div>
  );
};

export default BuildingLayer;
