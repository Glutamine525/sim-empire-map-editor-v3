import React, { FC } from 'react';
import { getColorTypeByBg } from '@/utils/color';
import styles from './index.module.css';

interface DebugBuildingKeyProps {
  row?: number;
  col?: number;
  bg?: string;
}

const DebugBuildingKey: FC<DebugBuildingKeyProps> = props => {
  const { row, col, bg = '#000000' } = props;

  return (
    <div
      className={styles.container}
      style={{
        color: getColorTypeByBg(bg) === 'dark' ? '#5f5f5f' : '#ababab',
      }}
    >
      {row}
      <br />
      {col}
    </div>
  );
};

export default DebugBuildingKey;
