import { MapLength, UnitPx } from '@/map-core/type';
import { isInRange } from '@/utils/coordinate';
import { settingSelector } from '@/store/selectors';
import { getColors } from '@/utils/color';
import React, { memo, useMemo } from 'react';
import { Layer, Rect, Shape } from 'react-konva';
import { useSelector } from 'react-redux';

const MapLayerCells = () => {
  const { theme } = useSelector(settingSelector);

  const { backgroundOuterColor, backgroundInnerColor, borderColor } = useMemo(
    () => getColors(theme),
    [theme],
  );

  return (
    <Layer name="cells" listening={false}>
      <Rect fill={backgroundOuterColor} width={MapLength * UnitPx} height={MapLength * UnitPx} />
      <Shape
        sceneFunc={(context) => {
          context._context.fillStyle = 'black';
          context._context.beginPath();
          context._context.moveTo(1755, 5);
          context._context.lineTo(5, 1755);
          context._context.lineTo(1725, 3475);
          context._context.lineTo(3475, 1725);
          context._context.closePath();
          context._context.fill();
          for (let li = 1; li <= 116; li++) {
            for (let co = 1; co <= 116; co++) {
              if (!isInRange(li, co)) {
                continue;
              }
              context._context.fillStyle = borderColor;
              context._context.fillRect((co - 1) * UnitPx, (li - 1) * UnitPx, UnitPx, UnitPx);
              context._context.fillStyle = backgroundInnerColor;
              context._context.fillRect(
                (co - 1) * UnitPx + 1,
                (li - 1) * UnitPx + 1,
                UnitPx - 2,
                UnitPx - 2,
              );
            }
          }
        }}
      />
    </Layer>
  );
};

export default memo(MapLayerCells);
