import React, { FC } from 'react';
import classcat from 'classcat';
import { MapCore } from '@/map-core';
import { BuildingConfig } from '@/map-core/building';
import { showMarker } from '@/utils/building';
import Block, { BlockProps } from '../block';
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
    row,
    col,
    w = 1,
    h = 1,
    text,
    isRoad,
    isHovered,
    isPreview,
    canPlace,
    isHidden,
  } = props;

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
      {text}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles['debug-coord']}>
          {row}
          <br />
          {col}
        </div>
      )}
    </Block>
  );
};

export default Building;
