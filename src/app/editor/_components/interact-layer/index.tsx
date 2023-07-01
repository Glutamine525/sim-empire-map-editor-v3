import React, { useState } from 'react';
import { BLOCK_PX } from '@/config';
import { MapLength, OperationType } from '@/map-core/type';
import { useMapConfig } from '../../_store/map-config';
import { mapContainer } from '../map';

const InteractLayer = () => {
  const operation = useMapConfig(state => state.operation);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [originMousePos, setOriginMousePos] = useState({ x: 0, y: 0 });
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
          // nativeEvent: { offsetX, offsetY },
          clientX,
          clientY,
        } = e;

        setOriginMousePos({
          x: mapContainer.current!.scrollLeft + clientX,
          y: mapContainer.current!.scrollTop + clientY,
        });

        // const line = Math.ceil(offsetY / BLOCK_PX);
        // const column = Math.ceil(offsetX / BLOCK_PX);

        // buildingData[line + '-' + column].set({ bg: 'pink' });
      }}
      onMouseMove={e => {
        const {
          nativeEvent: { offsetX, offsetY },
          clientX,
          clientY,
        } = e;

        const line = Math.ceil(offsetY / BLOCK_PX);
        const column = Math.ceil(offsetX / BLOCK_PX);

        if (line !== mouseCoord.line || column !== mouseCoord.column) {
          setMouseCoord({ line, column });
        }

        if (!isMouseDown) {
          return;
        }

        if (operation === OperationType.Empty) {
          mapContainer.current!.scrollLeft = originMousePos.x - clientX;
          mapContainer.current!.scrollTop = originMousePos.y - clientY;
        }

        // buildingData[line + '-' + column].set({ bg: 'pink' });
      }}
      onMouseUp={() => {
        setIsMouseDown(false);
      }}
    ></div>
  );
};

export default InteractLayer;
