'use client';

import React, { useEffect } from 'react';
import LayoutComponent from '@arco-design/web-react/es/Layout';
import LeftMenu from '@/components/editor/left-menu';
import Map from '@/components/editor/map';
import TopMenu from '@/components/editor/top-menu';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import withNoSSR from '@/utils/no-ssr';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import styles from './index.module.css';

const Page = () => {
  useEffect(() => {
    console.log(performance.now());
  }, []);

  console.log('page render');

  return (
    <LayoutComponent className={styles.container}>
      <TopMenu />
      <LayoutComponent
        hasSider={true}
        className={styles['content-container']}
        style={{
          height: `calc(100% - ${EDITOR_PAGE_UI_SETTING.topMenuHeight}px)`,
        }}
      >
        <LeftMenu />
        <Map />
      </LayoutComponent>
    </LayoutComponent>
  );
};

export default withNoSSR(Page);
