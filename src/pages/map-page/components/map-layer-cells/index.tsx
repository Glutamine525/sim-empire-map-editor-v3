import { MapLength, UnitPx } from '@/map-core/type';
import { isInRange } from '@/map-core/util';
import { settingSelector } from '@/store/selectors';
import { getColors } from '@/utils/color';
import React, { useMemo } from 'react';
import { Layer, Rect, Shape } from 'react-konva';
import { useSelector } from 'react-redux';

const MapLayerCells = () => {
  const { theme } = useSelector(settingSelector);

  const { backgroundOuterColor, backgroundInnerColor, borderColor } = useMemo(getColors, [theme]);

  return (
    <Layer name="cells">
      <Rect fill={backgroundOuterColor} width={MapLength * UnitPx} height={MapLength * UnitPx} />
      <Shape
        fill="black"
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(1755, 5);
          context.lineTo(5, 1755);
          context.lineTo(1725, 3475);
          context.lineTo(3475, 1725);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
      />
      <Shape
        fill={borderColor}
        sceneFunc={(context, shape) => {
          for (let li = 1; li <= 116; li++) {
            for (let co = 1; co <= 116; co++) {
              if (isInRange(li, co)) {
                context.beginPath();
                const x = (co - 1) * UnitPx;
                const y = (li - 1) * UnitPx;
                context.rect(x, y, UnitPx, UnitPx);
                context.closePath();
                context.fillStrokeShape(shape);
              }
            }
          }
        }}
      />
      <Shape
        fill={backgroundInnerColor}
        sceneFunc={(context, shape) => {
          for (let li = 1; li <= 116; li++) {
            for (let co = 1; co <= 116; co++) {
              if (isInRange(li, co)) {
                context.beginPath();
                const x = (co - 1) * UnitPx + 1;
                const y = (li - 1) * UnitPx + 1;
                context.rect(x, y, UnitPx - 2, UnitPx - 2);
                context.closePath();
                context.fillStrokeShape(shape);
              }
            }
          }
        }}
      />
    </Layer>
  );
};

export default MapLayerCells;
