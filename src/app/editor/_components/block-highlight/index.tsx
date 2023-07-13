import React, { FC } from 'react';
import classcat from 'classcat';
import Block, { BlockProps } from '../block';
import styles from './index.module.css';

export enum HighlightType {
  Protection = 'protection',
  Requirement = 'requirement',
}

interface BlockHighlightProps extends BlockProps {
  type: HighlightType;
}

const BlockHighlight: FC<BlockHighlightProps> = props => {
  const { type, w = 1, h = 1 } = props;
  return (
    <Block
      {...props}
      className={classcat([styles.container, styles[type]])}
      style={
        {
          '--size': `${Math.max(w, h)}px`,
        } as any
      }
    />
  );
};

export default BlockHighlight;
