import React, { FC } from 'react';
import './index.css';

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = props => {
  return (
    <input
      type="color"
      value={props.value}
      onChange={e => {
        props.onChange?.(e.currentTarget.value);
      }}
    />
  );
};

export default ColorPicker;
