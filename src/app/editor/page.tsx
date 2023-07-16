'use client';

import React, { useEffect } from 'react';
import { Layout } from '@arco-design/web-react';
import LeftMenu from './_components/left-menu';
import Map from './_components/map';
import TopMenu from './_components/top-menu';
import { UI_SETTING } from '@/app/editor/_config';
import withNoSSR from '@/utils/no-ssr';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import styles from './index.module.css';

const EditorPage = () => {
  console.log('Page render');

  useEffect(() => {
    console.log(performance.now());
  }, []);

  return (
    <Layout className={styles.container}>
      <TopMenu />
      <Layout
        hasSider={true}
        className={styles['content-container']}
        style={{
          height: `calc(100% - ${UI_SETTING.topMenuHeight}px)`,
        }}>
        <LeftMenu />
        <Map />
      </Layout>
    </Layout>
  );
};

export default withNoSSR(EditorPage);
