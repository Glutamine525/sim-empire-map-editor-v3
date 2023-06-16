import React, { FC } from 'react';
import { BLOCK_PX } from '@/config';
import styles from './index.module.css';

interface BlockProps {
  row: number;
  col: number;
  w?: number;
  h?: number;
  text?: string;
  bg?: string;
}

const Block: FC<BlockProps> = ({
  row,
  col,
  w = 1,
  h = 1,
  text = '',
  bg = '',
}) => {
  return (
    <div
      className={styles.container}
      style={{
        top: (row - 1) * BLOCK_PX,
        left: (col - 1) * BLOCK_PX,
        width: w * BLOCK_PX,
        height: h * BLOCK_PX,
        backgroundColor: bg,
      }}
    >
      {row}-{col}
      {text}
    </div>
  );
};

export default Block;
