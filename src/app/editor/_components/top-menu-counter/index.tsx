import React, { FC } from 'react';
import { MapCounterType } from '@/map-core/type';
import styles from './index.module.css';

const postfixMap = {
  [MapCounterType.House]: '个',
  [MapCounterType.Villa]: '个',
  [MapCounterType.Granary]: '个',
  [MapCounterType.Warehouse]: '个',
  [MapCounterType.Agriculture]: '/150个',
  [MapCounterType.Industry]: '/100个',
  [MapCounterType.General]: '个',
  [MapCounterType.Coverage]: '%',
};

interface ItemProps {
  type: MapCounterType;
  value: number;
}

const Item: FC<ItemProps> = ({ type, value }) => {
  return (
    <div className={styles.item}>
      <div className={styles.type}>{type}:</div>
      <div className={styles.value}>{value}</div>
      <div className={styles.postfix}>{postfixMap[type]}</div>
    </div>
  );
};

const TopMenuCounter = () => {
  return (
    <div className={styles.container}>
      <div className={styles.col}>
        <Item type={MapCounterType.House} value={0} />
        <Item type={MapCounterType.Villa} value={0} />
      </div>
      <div className={styles.col}>
        <Item type={MapCounterType.Granary} value={0} />
        <Item type={MapCounterType.Warehouse} value={0} />
      </div>
      <div className={styles.col}>
        <Item type={MapCounterType.Agriculture} value={0} />
        <Item type={MapCounterType.Industry} value={0} />
      </div>
      <div className={styles.col}>
        <Item type={MapCounterType.General} value={0} />
        <Item type={MapCounterType.Coverage} value={0} />
      </div>
    </div>
  );
};

export default TopMenuCounter;
