import React, { useState, useContext } from 'react';
import { StateContext } from '../Main/StateContext';
import { ChromePicker } from './react-color';

const normalizeHex = (str) =>
  str[0] === '#' ? str.toUpperCase() : `#${str.toUpperCase()}`;

const hexToHSL = (hex) => {
  // Convert hex to RGB first
  let r = 0;
  let g = 0;
  let b = 0;
  if (hex.length === 4) {
    r = `0x${hex[1]}${hex[1]}`;
    g = `0x${hex[2]}${hex[2]}`;
    b = `0x${hex[3]}${hex[3]}`;
  } else if (hex.length === 7) {
    r = `0x${hex[1]}${hex[2]}`;
    g = `0x${hex[3]}${hex[4]}`;
    b = `0x${hex[5]}${hex[6]}`;
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +s.toFixed(2);
  l = +l.toFixed(2);

  return { h, s, l };
};

function ColorContent() {
  const { colors, setColors } = useContext(StateContext);
  const [focusedInput, setFocusedInput] = useState('');

  const handleColorChange = (name, value) => {
    setColors({ ...colors, [name]: value });
  };

  return (
    <>
      <h3>Heading Colors</h3>
      {Object.entries(colors).map(([label, color]) => {
        const isFocused = label === focusedInput;
        return (
          <ColorInput
            key={label}
            {...{
              label,
              color,
              handleColorChange,
              isFocused,
              onFocus: setFocusedInput,
            }}
          />
        );
      })}
    </>
  );
}

function ColorInput({ label, color, handleColorChange, isFocused, onFocus }) {
  const [textColor, setTextColor] = useState('#000');

  const handleInputChange = (e) => {
    const {
      target: { value },
    } = e;
    const normalized = normalizeHex(value);
    handleColorChange(label, normalized);
    if (normalized.length === 4 || normalized.length === 7) {
      const { l } = hexToHSL(normalized);
      setTextColor(l > 0.6 ? '#000' : '#fff');
    }
  };

  const handlePickerChange = (newColor) => {
    const {
      hex,
      hsl: { l },
    } = newColor;
    handleColorChange(label, hex);
    setTextColor(l > 0.6 ? '#000' : '#fff');
  };

  return (
    <div className="row">
      <label className="row__spacer" htmlFor={`${label}Color`}>
        {label[0].toUpperCase() + label.slice(1, label.length)}
      </label>
      <input
        id={`${label}Color`}
        className="jscolor"
        spellCheck="false"
        value={color.toUpperCase()}
        style={{ backgroundColor: color, color: textColor }}
        onChange={handleInputChange}
        onFocus={() => onFocus(label)}
      />
      {/* TODO: toggle ColorPicker properly when clicking out of clicking out of input */}
      {isFocused && (
        <ChromePicker
          color={color}
          onChange={handlePickerChange}
          disableAlpha={true}
        />
      )}
    </div>
  );
}

export default ColorContent;
