import React, { FC } from 'react';
import { useBuildingData } from '@/store/building-data';
import Block from '../block';

interface BuildingProps {
  row: number;
  col: number;
}

const Building: FC<BuildingProps> = ({ row, col }) => {
  const [data] = useBuildingData(row, col);

  return <Block row={row} col={col} bg={data.bg} />;
};

export default Building;
