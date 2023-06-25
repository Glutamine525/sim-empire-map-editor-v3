import React, { useState } from 'react';
import { buildingData } from '@/app/editor/_store/building-data';
import { BLOCK_PX } from '@/config';
import { MapLength } from '@/map-core/type';

const InteractLayer = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseCoord, setMouseCoord] = useState({ line: 0, column: 0 });

  console.log('InteractLayer render');

  return (
    <div
      style={{
        position: 'relative',
        width: MapLength * BLOCK_PX,
        height: MapLength * BLOCK_PX,
      }}
      onMouseDown={e => {
        setIsMouseDown(true);
        const {
          nativeEvent: { offsetX, offsetY },
        } = e;

        const line = Math.ceil(offsetY / BLOCK_PX);
        const column = Math.ceil(offsetX / BLOCK_PX);

        buildingData[line + '-' + column].set({ bg: 'pink' });
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

        buildingData[line + '-' + column].set({ bg: 'pink' });
      }}
      onMouseUp={() => {
        setIsMouseDown(false);
      }}
    ></div>
  );
};

export default InteractLayer;
