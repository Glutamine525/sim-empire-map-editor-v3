import React, { useMemo } from 'react';
import BuildingLayer from '../building-layer';
import InteractLayer from '../interact-layer';

const Chessboard = () => {
  const buildings = useMemo(() => <BuildingLayer />, []);

  console.log('Chessboard render');

  return (
    <>
      {buildings}
      <InteractLayer />
    </>
  );
};

export default Chessboard;
