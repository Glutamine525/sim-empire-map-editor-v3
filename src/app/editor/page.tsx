'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@arco-design/web-react';
import Loading from '@/app/editor/_components/loading';
import { UI_SETTING } from '@/app/editor/_config';
import LeftMenu from './_components/left-menu';
import Map from './_components/map';
import TopMenu from './_components/top-menu';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import styles from './index.module.css';

const EditorPage = () => {
  console.log('Page render');

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading key="loading" />;
  }

  return (
    <>
      <Layout className={styles.container}>
        <TopMenu />
        <Layout
          hasSider={true}
          className={styles['content-container']}
          style={{
            height: `calc(100% - ${UI_SETTING.topMenuHeight}px)`,
          }}
        >
          <LeftMenu />
          <Map />
        </Layout>
      </Layout>
      <Loading key="loading" />
    </>
  );
};

export default EditorPage;
