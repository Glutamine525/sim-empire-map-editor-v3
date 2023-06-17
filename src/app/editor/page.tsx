'use client';

import React, { useEffect } from 'react';
import LayoutComponent from '@arco-design/web-react/es/Layout';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import withNoSSR from '@/utils/no-ssr';
import LeftMenu from './_components/left-menu';
import Map from './_components/map';
import TopMenu from './_components/top-menu';
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
