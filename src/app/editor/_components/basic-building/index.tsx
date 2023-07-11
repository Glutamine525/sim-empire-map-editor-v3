import React, { FC } from 'react';
import classcat from 'classcat';
import MapCore from '@/app/editor/_map-core';
import { useBuildingData } from '@/app/editor/_store/building-data';
import { showMarker } from '@/utils/building';
import Block from '../block';
import styles from './index.module.css';

interface BasicBuildingProps {
  row: number;
  col: number;
}

const core = MapCore.getInstance();

const BasicBuilding: FC<BasicBuildingProps> = ({ row, col }) => {
  const [data] = useBuildingData(row, col);
  const { w = 0, h = 0 } = data;

  return (
    <Block
      row={row}
      col={col}
      {...data}
      className={classcat({
        [styles.container]: true,
        [styles.large]: w > 1 || h > 1,
      })}
    >
      {showMarker(data) && (
        <>
          {data.isRoad ? (
            <>{data.marker}</>
          ) : (
            <div
              className={classcat({
                [styles['circle-marker']]: true,
                [styles['full-protection']]:
                  data.marker === core.protection.length,
              })}
            />
          )}
        </>
      )}
      {data.isFixed && !data.isBarrier && (
        <div className={styles.fixed}>📌</div>
      )}
      {data.text}
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

export default BasicBuilding;
