import React, { FC, PropsWithChildren } from 'react';
import './index.css';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <main>{children}</main>;
};

export default Layout;
