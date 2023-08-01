import { FC, PropsWithChildren } from 'react';
import './globals.css';

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
};

export default RootLayout;
