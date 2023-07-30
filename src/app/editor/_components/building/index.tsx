import React, { FC } from 'react';
import classcat from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  BuildingConfig,
  CatalogType,
} from '@/app/editor/_map-core/building/type';
import { showMarker } from '@/utils/building';
import { useSetting } from '../../_store/settings';
import Block, { BlockProps } from '../block';
import BuildingIcon from '../building-icon';
import BuildingProtectionCount from '../building-protection-count';
import DebugBuildingKey from '../debug-building-key';
import styles from './index.module.css';

interface BuildingProps extends BlockProps, BuildingConfig {
  isHovered?: boolean;
  isPreview?: boolean;
  canPlace?: boolean;
  isHidden?: boolean;
}

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

  const [
    enableFixedBuildingIcon,
    enableSpecialBuildingIcon,
    protectionCountStyle,
  ] = useSetting(
    state => [
      state.enableFixedBuildingIcon,
      state.enableSpecialBuildingIcon,
      state.protectionCountStyle,
    ],
    shallow,
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
        <BuildingProtectionCount
          marker={props.marker}
          styleType={protectionCountStyle}
        />
      )}
      {enableFixedBuildingIcon && isFixed && !isBarrier && (
        <BuildingIcon type="fixed" />
      )}
      {enableSpecialBuildingIcon && props.catalog === CatalogType.Special && (
        <BuildingIcon type="special" bg={props.bg} />
      )}
      {text}
      {process.env.NODE_ENV === 'development' && !props.isBarrier && (
        <DebugBuildingKey row={props.row} col={props.col} bg={props.bg} />
      )}
    </Block>
  );
};

export default Building;
