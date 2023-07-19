import React, { FC } from 'react';
import classcat from 'classcat';
import MapCore from '../../_map-core';
import { ProtectionCountStyleType } from '../../_store/settings';
import styles from './index.module.css';

const core = MapCore.getInstance();

interface BuildingProtectionCountProps {
  marker?: number;
  styleType: ProtectionCountStyleType;
}

const BuildingProtectionCount: FC<BuildingProtectionCountProps> = props => {
  const { marker = 0, styleType } = props;

  return (
    <div
      className={classcat({
        [styles['container']]: true,
        [styles['full-protection']]: marker === core.protection.length,
        [styles.number]: styleType === ProtectionCountStyleType.Number,
      })}
    >
      {styleType === ProtectionCountStyleType.Number ? marker : null}
    </div>
  );
};

export default BuildingProtectionCount;
