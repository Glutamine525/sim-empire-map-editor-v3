import React, { FC } from 'react';
import { Message } from '@arco-design/web-react';
import classcat from 'classcat';
import copy from 'copy-to-clipboard';
import { shallow } from 'zustand/shallow';
import { GITHUB_LINK, VERSION, WEB_LINK } from '../../_config';
import { CivilTypeLabel } from '../../_map-core/type';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

interface CopyrightProps {
  isInteractLayer?: boolean;
}

const Copyright: FC<CopyrightProps> = props => {
  const { isInteractLayer } = props;

  const [civil, mapType, noTree] = useMapConfig(
    state => [state.civil, state.mapType, state.noTree],
    shallow,
  );

  return (
    <div
      className={classcat({
        [styles.container]: true,
        [styles['interact-layer']]: isInteractLayer,
      })}
    >
      <div className={styles.title}>
        <span className={styles.civil}>{CivilTypeLabel[civil]}</span>
        <span className={styles['map-type']}>{mapType}木</span>
        <span className={styles['no-tree']}>{noTree ? '无木' : '有木'}</span>
        <span className={styles['map-layout']}>地图布局</span>
      </div>
      <div className={styles.author}>
        <span>From the Map Editor</span>
        <strong>V{VERSION}</strong>
        <span>Implemented by</span>
        <strong>Glutamine525</strong>
      </div>
      <div className={styles['web-link']}>
        <div>
          <span>Github:</span>
          <strong
            onClick={() => {
              window.open(GITHUB_LINK);
            }}
          >
            Glutamine525/sim-empire-map-editor-v3
          </strong>
        </div>
        <div>
          <span>网页链接:</span>
          <strong
            onClick={() => {
              const success = copy(WEB_LINK);
              if (success) {
                Message.success('成功复制到剪贴板');
              } else {
                Message.error('复制失败');
              }
            }}
          >
            simempire.fun
          </strong>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
