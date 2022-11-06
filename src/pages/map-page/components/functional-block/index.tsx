import { BorderStyleType } from '@/map-core/building';
import React, { FC } from 'react';
import { Group } from 'react-konva';
import BorderBlock from '../border-block';

interface FunctionalBlockProps {
  initLi: number;
  initCo: number;
  curLi: number;
  curCo: number;
  hidden?: boolean;
  borderColor: string;
  borderStyle?: BorderStyleType;
  backgroundColor: string;
  backgroundOpacity?: number;
}

const FunctionalBlock: FC<FunctionalBlockProps> = (props) => {
  const {
    initLi,
    initCo,
    curLi,
    curCo,
    hidden = true,
    borderColor,
    borderStyle = BorderStyleType.Dashed,
    backgroundColor,
    backgroundOpacity = 1,
  } = props;

  const deltaLi = curLi - initLi;
  const deltaCo = curCo - initCo;
  const w = deltaCo > 0 ? deltaCo + 1 : Math.abs(deltaCo - 1);
  const h = deltaLi > 0 ? deltaLi + 1 : Math.abs(deltaLi - 1);

  return (
    <Group visible={!hidden}>
      <BorderBlock
        mode="absolute"
        line={deltaLi < 0 ? initLi + deltaLi : initLi}
        column={deltaCo < 0 ? initCo + deltaCo : initCo}
        width={w}
        height={h}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        backgroundOpacity={backgroundOpacity}
        borderTStyle={borderStyle}
        borderRStyle={borderStyle}
        borderBStyle={borderStyle}
        borderLStyle={borderStyle}
      />
    </Group>
  );
};

export default FunctionalBlock;
