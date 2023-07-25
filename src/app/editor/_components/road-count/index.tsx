import React, { FC } from 'react';
import classcat from 'classcat';
import { RoadCountStyleType } from '../../_store/settings';
import styles from './index.module.css';

interface RoadCountProps {
  marker?: number;
  styleType: RoadCountStyleType;
}

const RoadCount: FC<RoadCountProps> = props => {
  const { marker = 0, styleType } = props;

  return (
    <div
      className={classcat({
        [styles['big-number']]:
          styleType === RoadCountStyleType.CenterBigNumber,
        [styles['small-number']]:
          styleType === RoadCountStyleType.TopLeftSmallNumber,
      })}
    >
      {marker}
    </div>
  );
};

export default RoadCount;
