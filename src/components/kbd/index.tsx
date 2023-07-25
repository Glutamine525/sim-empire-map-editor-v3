import React, { FC, ReactNode } from 'react';
import classcat from 'classcat';
import styles from './index.module.css';

interface KbdProps {
  showArrow?: boolean;
  children: ReactNode;
}

const Kbd: FC<KbdProps> = props => {
  const { showArrow = false, children } = props;

  return (
    <div
      className={classcat({
        [styles.container]: true,
        [styles.arrow]: showArrow,
      })}
    >
      {children}
    </div>
  );
};

export default Kbd;
