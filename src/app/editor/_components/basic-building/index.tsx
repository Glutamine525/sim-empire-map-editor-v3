import React, { FC } from 'react';
import classcat from 'classcat';
import { shallow } from 'zustand/shallow';
import { useBuildingData } from '@/app/editor/_store/building-data';
import { showMarker } from '@/utils/building';
import { CatalogType } from '../../_map-core/building/type';
import { useSetting } from '../../_store/settings';
import Block from '../block';
import BuildingIcon from '../building-icon';
import BuildingProtectionCount from '../building-protection-count';
import DebugBuildingKey from '../debug-building-key';
import RoadCount from '../road-count';
import styles from './index.module.css';

interface BasicBuildingProps {
  row: number;
  col: number;
}

const BasicBuilding: FC<BasicBuildingProps> = ({ row, col }) => {
  const [data] = useBuildingData(row, col);
  const { w = 0, h = 0 } = data;

  const [
    enableFixedBuildingIcon,
    enableSpecialBuildingIcon,
    enableDebugCoordInEmptyCell,
    protectionCountStyle,
    roadCountStyle,
  ] = useSetting(
    state => [
      state.enableFixedBuildingIcon,
      state.enableSpecialBuildingIcon,
      state.enableDebugCoordInEmptyCell,
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
        <BuildingIcon type="fixed" />
      )}
      {enableSpecialBuildingIcon && data.catalog === CatalogType.Special && (
        <BuildingIcon type="special" bg={data.bg} />
      )}
      {data.text}
      {((!enableDebugCoordInEmptyCell && !data.isEmpty) ||
        enableDebugCoordInEmptyCell) &&
        process.env.NODE_ENV === 'development' &&
        !data.isBarrier && (
          <DebugBuildingKey row={row} col={col} bg={data.bg} />
        )}
    </Block>
  );
};

export default BasicBuilding;
