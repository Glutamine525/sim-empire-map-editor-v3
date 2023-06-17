import React, { useState } from 'react';
import { BLOCK_PX, CHESSBOARD_LEN } from '@/config';
import { mapData } from '@/store/map-data';

const InteractLayer = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseCoord, setMouseCoord] = useState({ line: 0, column: 0 });

  console.log('InteractLayer render');

  return (
    <div
      style={{
        position: 'relative',
        width: CHESSBOARD_LEN * BLOCK_PX,
        height: CHESSBOARD_LEN * BLOCK_PX,
      }}
      onMouseDown={e => {
        setIsMouseDown(true);
        const {
          nativeEvent: { offsetX, offsetY },
        } = e;

        const line = Math.ceil(offsetY / BLOCK_PX);
        const column = Math.ceil(offsetX / BLOCK_PX);

        mapData[line + '-' + column].set({ bg: 'pink' });
      }}
      onMouseMove={e => {
        const {
          nativeEvent: { offsetX, offsetY },
        } = e;

        const line = Math.ceil(offsetY / BLOCK_PX);
        const column = Math.ceil(offsetX / BLOCK_PX);

        if (line !== mouseCoord.line || column !== mouseCoord.column) {
          setMouseCoord({ line, column });
        }

        if (!isMouseDown) {
          return;
        }

        mapData[line + '-' + column].set({ bg: 'pink' });
      }}
      onMouseUp={() => {
        setIsMouseDown(false);
      }}
    ></div>
  );
};

export default InteractLayer;
