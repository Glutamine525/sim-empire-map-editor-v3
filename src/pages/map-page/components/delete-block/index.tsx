import { getArcoColor } from '@/utils/color';
import React, { FC } from 'react';
import FunctionalBlock from '../functional-block';

interface DeleteBlockProps {
  initLi: number;
  initCo: number;
  curLi: number;
  curCo: number;
  hidden?: boolean;
}

const DeleteBlock: FC<DeleteBlockProps> = (props) => {
  return (
    <FunctionalBlock
      {...props}
      borderColor={getArcoColor('--red-6')}
      backgroundColor={getArcoColor('--red-3')}
      backgroundOpacity={0.5}
    />
  );
};

export default DeleteBlock;
