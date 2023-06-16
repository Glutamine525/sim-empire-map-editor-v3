import React from 'react';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import styles from './index.module.css';

const TopMenu = () => {
  return (
    <div
      className={styles.container}
      style={{
        height: EDITOR_PAGE_UI_SETTING.topMenuHeight,
      }}
    >
      TopMenu
    </div>
  );
};

export default TopMenu;
