'use client';

import React, { useEffect } from 'react';
import LeftMenu from '@/components/editor/left-menu';
import Map from '@/components/editor/map';
import TopMenu from '@/components/editor/top-menu';
import withNoSSR from '@/utils/no-ssr';

const Page = () => {
  useEffect(() => {
    console.log(performance.now());
  }, []);

  console.log('page render');

  return (
    <>
      <TopMenu />
      <LeftMenu />
      <Map />
    </>
  );
};

export default withNoSSR(Page);
