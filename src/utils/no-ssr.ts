import { FC } from 'react';
import dynamic from 'next/dynamic';

const withNoSSR = <T>(Component: FC<T>) =>
  dynamic(() => Promise.resolve(Component), { ssr: false });

export default withNoSSR;
