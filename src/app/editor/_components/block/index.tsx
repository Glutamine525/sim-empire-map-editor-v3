import React, { CSSProperties, FC, ReactNode } from 'react';
import classcat from 'classcat';
import { BLOCK_PX } from '@/app/editor/_config';
import { BorderStyleType } from '@/app/editor/_map-core/building/type';
import styles from './index.module.css';

export interface BlockProps {
  row?: number;
  col?: number;
  w?: number;
  h?: number;
  color?: string;
  bg?: string;
  borderTStyle?: BorderStyleType;
  borderRStyle?: BorderStyleType;
  borderBStyle?: BorderStyleType;
  borderLStyle?: BorderStyleType;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

const Block: FC<BlockProps> = ({
  row = 0,
  col = 0,
  w = 1,
  h = 1,
  color,
  bg,
  borderTStyle,
  borderRStyle,
  borderBStyle,
  borderLStyle,
  style,
  className = '',
  children,
}) => {
  if (!row || !col) {
    return null;
  }

  return (
    <div
      className={classcat([styles.container, className])}
      style={{
        top: (row - 1) * BLOCK_PX,
        left: (col - 1) * BLOCK_PX,
        width: w * BLOCK_PX,
        height: h * BLOCK_PX,
        color,
        backgroundColor: bg,
        borderTopStyle: borderTStyle,
        borderRightStyle: borderRStyle,
        borderBottomStyle: borderBStyle,
        borderLeftStyle: borderLStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Block;
