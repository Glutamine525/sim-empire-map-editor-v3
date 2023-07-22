import React, { FC, PropsWithChildren } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '模拟帝国布局图编辑器',
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
