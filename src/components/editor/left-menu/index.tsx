import React from 'react';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import styles from './index.module.css';

const LeftMenu = () => {
  return (
    <div
      className={styles.container}
      style={{
        width: EDITOR_PAGE_UI_SETTING.leftMenuWidth,
        paddingTop: EDITOR_PAGE_UI_SETTING.topMenuHeight,
      }}
    >
      LeftMenu
    </div>
  );
};

export default LeftMenu;
