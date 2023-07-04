import React, { CSSProperties, FC, ReactNode } from 'react';
import classcat from 'classcat';
import { BLOCK_PX } from '@/app/editor/_config';
import { BorderStyleType } from '@/map-core/building';
import styles from './index.module.css';

export interface BlockProps {
  row: number;
  col: number;
  w?: number;
  h?: number;
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
  row,
  col,
  w = 1,
  h = 1,
  bg = '',
  borderTStyle = BorderStyleType.Solid,
  borderRStyle = BorderStyleType.Solid,
  borderBStyle = BorderStyleType.Solid,
  borderLStyle = BorderStyleType.Solid,
  style,
  className = '',
  children,
}) => {
  return (
    <div
      className={classcat({
        [styles.container]: true,
        [className]: true,
      })}
      style={{
        top: (row - 1) * BLOCK_PX,
        left: (col - 1) * BLOCK_PX,
        width: w * BLOCK_PX,
        height: h * BLOCK_PX,
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
