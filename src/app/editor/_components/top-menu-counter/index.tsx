import React, { FC, memo } from 'react';
import { shallow } from 'zustand/shallow';
import { MapCounterType } from '@/map-core/type';
import { useMapConfig } from '../../_store/map-config';
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
  const [counter, emptyCells] = useMapConfig(
    state => [state.counter, state.emptyCells],
    shallow,
  );

  return (
    <div className={styles.container}>
      <div className={styles.col}>
        <Item
          type={MapCounterType.House}
          value={counter[MapCounterType.House]}
        />
        <Item
          type={MapCounterType.Villa}
          value={counter[MapCounterType.Villa]}
        />
      </div>
      <div className={styles.col}>
        <Item
          type={MapCounterType.Granary}
          value={counter[MapCounterType.Granary]}
        />
        <Item
          type={MapCounterType.Warehouse}
          value={counter[MapCounterType.Warehouse]}
        />
      </div>
      <div className={styles.col}>
        <Item
          type={MapCounterType.Agriculture}
          value={counter[MapCounterType.Agriculture]}
        />
        <Item
          type={MapCounterType.Industry}
          value={counter[MapCounterType.Industry]}
        />
      </div>
      <div className={styles.col}>
        <Item
          type={MapCounterType.General}
          value={counter[MapCounterType.General]}
        />
        <Item
          type={MapCounterType.Coverage}
          value={Number(
            (
              (counter[MapCounterType.Coverage] / (emptyCells || 1)) *
              100
            ).toFixed(2),
          )}
        />
      </div>
    </div>
  );
};

export default memo(TopMenuCounter);
