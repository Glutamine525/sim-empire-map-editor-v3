import React, { FC } from 'react';
import { useBuildingData } from '@/app/editor/_store/building-data';
import Block from '../block';
import styles from './index.module.css';

interface BuildingProps {
  row: number;
  col: number;
}

const Building: FC<BuildingProps> = ({ row, col }) => {
  const [data] = useBuildingData(row, col);

  return (
    <Block row={row} col={col} {...data}>
      {process.env.NODE_ENV === 'development' && !data.isBarrier && (
        <div className={styles['debug-coord']}>
          {row}
          <br />
          {col}
        </div>
      )}
    </Block>
  );
};

export default Building;
