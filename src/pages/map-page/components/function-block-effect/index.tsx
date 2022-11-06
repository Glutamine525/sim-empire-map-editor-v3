import { UnitPx } from '@/map-core/type';
import React, { FC } from 'react';
import styles from './index.module.less';

interface FunctionBlockEffectProps {
  line: number;
  column: number;
  width: number;
  height: number;
  effectColor: string;
}

const FunctionBlockEffect: FC<FunctionBlockEffectProps> = (props) => {
  const { line, column, width, height, effectColor } = props;

  return (
    <div
      className={styles.container}
      style={{
        top: (line - 1) * UnitPx,
        left: (column - 1) * UnitPx,
        width: width * UnitPx,
        height: height * UnitPx,
        boxShadow: `inset 0px 0px 5px 3px ${effectColor}`,
      }}
    />
  );
};

export default FunctionBlockEffect;
