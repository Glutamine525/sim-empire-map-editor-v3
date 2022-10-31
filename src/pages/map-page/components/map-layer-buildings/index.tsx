import React, { createRef, memo, useEffect } from 'react';
import { Layer } from 'react-konva';
import Konva from 'konva';

export const layerRef = createRef<Konva.Layer>();

const MapLayerBuildings = () => {
  useEffect(() => {
    layerRef.current?.on('draw', () => {
      console.log('BuildingLayer draw finished');
    });
  }, []);

  return <Layer name="buildings" ref={layerRef} clearBeforeDraw={false} />;
};

export default memo(MapLayerBuildings);
