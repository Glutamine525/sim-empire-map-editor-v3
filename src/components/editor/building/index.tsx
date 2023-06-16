import React, { FC } from 'react';
import { useMapData } from '@/store/map-data';
import Block from '../block';

interface BuildingProps {
  row: number;
  col: number;
}

const Building: FC<BuildingProps> = ({ row, col }) => {
  const [data] = useMapData(row, col);

  return (
    <div>
      <Block row={row} col={col} bg={data.bg} />
    </div>
  );
};

export default Building;
