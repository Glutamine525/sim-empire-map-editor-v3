import React from 'react';
import { shallow } from 'zustand/shallow';
import { OperationType } from '@/map-core/type';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

const TopMenuOperation = () => {
  const [operation, brush] = useMapConfig(
    state => [state.operation, state.brush],
    shallow,
  );

  return (
    <div className={styles.container}>
      <div>当前操作:</div>
      <div className={styles.text}>
        {operation === OperationType.PlaceBuilding
          ? `${operation} ${Array.from(
              new Set([brush?.catalog, brush?.name]),
            ).join('-')}`
          : operation}
      </div>
    </div>
  );
};

export default TopMenuOperation;
