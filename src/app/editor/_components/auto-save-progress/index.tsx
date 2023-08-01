import React, { useEffect, useRef, useState } from 'react';
import { useDocumentVisibility } from 'ahooks';
import { shallow } from 'zustand/shallow';
import { UI_SETTING } from '../../_config';
import { useAutoSave } from '../../_store/auto-save';
import { useMapConfig } from '../../_store/map-config';
import { useSetting } from '../../_store/settings';
import styles from './index.module.css';

const AutoSaveProgress = () => {
  const leftMenuWidth = useMapConfig(state => state.leftMenuWidth);
  const [autoSaveInterval, enableAutoSaveProgress] = useSetting(
    state => [state.autoSaveInterval, state.enableAutoSaveProgress],
    shallow,
  );
  const nextAutoSaveTime = useAutoSave(state => state.nextAutoSaveTime);
  const visibility = useDocumentVisibility();

  const [progress, setProgress] = useState(100);

  const timer = useRef(0);

  useEffect(() => {
    if (visibility === 'hidden') {
      return;
    }

    const render = () => {
      setProgress(
        ((nextAutoSaveTime - Date.now()) / (autoSaveInterval * 1000)) * 100,
      );
      timer.current = requestAnimationFrame(render);
    };
    timer.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(timer.current);
    };
  }, [nextAutoSaveTime, autoSaveInterval, visibility]);

  if (!enableAutoSaveProgress) {
    return null;
  }

  return (
    <div
      className={styles.container}
      style={{
        top: UI_SETTING.topMenuHeight,
        left: leftMenuWidth,
        width: `calc(100% - ${leftMenuWidth}px)`,
      }}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default AutoSaveProgress;
