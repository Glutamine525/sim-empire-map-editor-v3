import React, { FC } from 'react';
import classcat from 'classcat';
import { shallow } from 'zustand/shallow';
import { useBuildingData } from '@/app/editor/_store/building-data';
import { showMarker } from '@/utils/building';
import { useSetting } from '../../_store/settings';
import Block from '../block';
import BuildingProtectionCount from '../building-protection-count';
import FixedBuildingIcon from '../fixed-building-icon';
import RoadCount from '../road-count';
import styles from './index.module.css';

interface BasicBuildingProps {
  row: number;
  col: number;
}

const BasicBuilding: FC<BasicBuildingProps> = ({ row, col }) => {
  const [data] = useBuildingData(row, col);
  const { w = 0, h = 0 } = data;

  const [enableFixedBuildingIcon, protectionCountStyle, roadCountStyle] =
    useSetting(
      state => [
        state.enableFixedBuildingIcon,
        state.protectionCountStyle,
        state.roadCountStyle,
      ],
      shallow,
    );

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
            <RoadCount marker={data.marker} styleType={roadCountStyle} />
          ) : (
            <BuildingProtectionCount
              marker={data.marker}
              styleType={protectionCountStyle}
            />
          )}
        </>
      )}
      {enableFixedBuildingIcon && data.isFixed && !data.isBarrier && (
        <FixedBuildingIcon />
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
