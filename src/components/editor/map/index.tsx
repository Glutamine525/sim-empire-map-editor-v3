import React, { useEffect, useMemo, useRef } from 'react';
import Content from '@arco-design/web-react/es/Layout/content';
import PerfectScrollbar from 'perfect-scrollbar';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';
import styles from './index.module.css';

const Map = () => {
  const buildings = useMemo(() => <BuildingLayer />, []);

  const container = useRef<HTMLDivElement>(null);

  console.log('Chessboard render');

  useEffect(() => {
    new PerfectScrollbar(container.current!, {
      wheelPropagation: true,
    });
    const { scrollHeight, scrollWidth, clientWidth, clientHeight } =
      container.current!;
    container.current!.scrollTo(
      (scrollWidth - clientWidth) / 2,
      (scrollHeight - clientHeight) / 2,
    );
  }, []);

  return (
    <Content className={styles.wrapper}>
      <div ref={container} className={styles.container}>
        {buildings}
        <InteractLayer />
      </div>
    </Content>
  );
};

export default Map;
