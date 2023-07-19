import React, { FC } from 'react';
import classcat from 'classcat';
import MapCore from '@/app/editor/_map-core';
import { BuildingConfig } from '@/app/editor/_map-core/building/type';
import { showMarker } from '@/utils/building';
import { useSetting } from '../../_store/settings';
import Block, { BlockProps } from '../block';
import FixedBuildingIcon from '../fixed-building-icon';
import styles from './index.module.css';

interface BuildingProps extends BlockProps, BuildingConfig {
  isHovered?: boolean;
  isPreview?: boolean;
  canPlace?: boolean;
  isHidden?: boolean;
}

const core = MapCore.getInstance();

const Building: FC<BuildingProps> = props => {
  const {
    w = 1,
    h = 1,
    isFixed,
    isBarrier,
    text,
    isRoad,
    isHovered,
    isPreview,
    canPlace,
    isHidden,
  } = props;

  const enableFixedBuildingIcon = useSetting(
    state => state.enableFixedBuildingIcon,
  );

  return (
    <Block
      {...props}
      className={classcat({
        [props.className || '']: true,
        [styles.container]: true,
        [styles.large]: w > 1 || h > 1,
        [styles['is-hovered']]: isHovered,
        [styles['is-preview']]: isPreview,
        [styles['can-place']]: canPlace,
        [styles['is-hidden']]: isHidden,
      })}
    >
      {!isRoad && showMarker(props) && (
        <div
          className={classcat({
            [styles['circle-marker']]: true,
            [styles['full-protection']]:
              props.marker === core.protection.length,
          })}
        />
      )}
      {enableFixedBuildingIcon && isFixed && !isBarrier && (
        <FixedBuildingIcon />
      )}
      {text}
    </Block>
  );
};

export default Building;
