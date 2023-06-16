import React, { Fragment } from 'react';
import { BLOCK_PX, CHESSBOARD_LEN } from '@/config';
import Building from '../building';

const BuildingLayer = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: CHESSBOARD_LEN * BLOCK_PX,
        height: CHESSBOARD_LEN * BLOCK_PX,
      }}
    >
      {Array.from(Array(CHESSBOARD_LEN), (_, row) => {
        return (
          <Fragment key={row + 1}>
            {Array.from(Array(CHESSBOARD_LEN), (_, col) => {
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
