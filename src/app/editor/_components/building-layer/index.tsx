import React, { Fragment } from 'react';
import { BLOCK_PX } from '@/app/editor/_config';
import { MapLength } from '@/app/editor/_map-core/type';
import { isInRange } from '@/utils/coordinate';
import BasicBuilding from '../basic-building';
import Copyright from '../copyright';
import styles from './index.module.css';

const Border = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    version="1.1"
  >
    <path d="M1755 5 L5 1755 L1725 3475 L3475 1725 Z" fill="black" />
  </svg>
);

const BuildingLayer = () => {
  console.log('BuildingLayer render');

  return (
    <div
      id="building-layer"
      className={styles.wrapper}
      style={{
        width: (MapLength + 2) * BLOCK_PX,
        height: (MapLength + 2) * BLOCK_PX,
        padding: BLOCK_PX,
      }}
    >
      <div
        className={styles.container}
        style={{
          width: MapLength * BLOCK_PX,
          height: MapLength * BLOCK_PX,
        }}
      >
        <Border />
        <Copyright />
        {Array.from(Array(MapLength), (_, _r) => {
          return (
            <Fragment key={_r + 1}>
              {Array.from(Array(MapLength), (_, _c) => {
                const [row, col] = [_r + 1, _c + 1];
                if (!isInRange(row, col)) {
                  return null;
                }
                const id = `${row}-${col}`;
                return <BasicBuilding key={id} row={row} col={col} />;
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BuildingLayer;
