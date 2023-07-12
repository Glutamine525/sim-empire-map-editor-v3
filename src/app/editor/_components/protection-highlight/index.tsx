import React, { FC } from 'react';
import { BLOCK_PX } from '../../_config';
import Block, { BlockProps } from '../block';
import styles from './index.module.css';

const ProtectionHighlight: FC<BlockProps> = props => {
  const { w = 1, h = 1 } = props;
  return (
    <Block
      {...props}
      className={styles.container}
      style={{
        boxShadow: `inset 0 0 ${(Math.max(w, h) * BLOCK_PX) / 3}px ${
          (Math.max(w, h) * BLOCK_PX) / 10
        }px white`,
      }}
    />
  );
};

export default ProtectionHighlight;
