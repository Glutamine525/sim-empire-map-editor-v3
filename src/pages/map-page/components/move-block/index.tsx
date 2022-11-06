import { getArcoColor } from '@/utils/color';
import React, { FC } from 'react';
import FunctionalBlock from '../functional-block';

interface MoveBlockProps {
  initLi: number;
  initCo: number;
  curLi: number;
  curCo: number;
  hidden?: boolean;
}

const MoveBlock: FC<MoveBlockProps> = (props) => {
  return (
    <FunctionalBlock
      {...props}
      borderColor={getArcoColor('--blue-6')}
      backgroundColor={getArcoColor('--blue-3')}
      backgroundOpacity={0.5}
    />
  );
};

export default MoveBlock;
