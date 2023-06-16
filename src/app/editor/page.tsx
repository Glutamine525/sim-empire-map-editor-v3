'use client';

import React, { useEffect } from 'react';
import Chessboard from '@/components/editor/chessboard';
import withNoSSR from '@/utils/no-ssr';

const Page = () => {
  useEffect(() => {
    console.log(performance.now());
  }, []);

  console.log('page render');

  return (
    <>
      <Chessboard />
    </>
  );
};

export default withNoSSR(Page);
