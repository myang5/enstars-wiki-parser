import React, { useState, useContext } from 'react';
import { StateContext } from '../StateContext';
import { ChromePicker } from './react-color';
import { AUTHOR_NAMES, DETAILS_KEYS, GAME_OPTIONS } from '../../constants';

const authors = Object.values(AUTHOR_NAMES);

export default function DetailContent() {
  const { details, setDetails } = useContext(StateContext);
  const [focusedInput, setFocusedInput] = useState('');

  const handleChange = (e) => {
    const {
      target: { id, value },
    } = e;
    setDetails({ ...details, [id]: value });
  };

  const handleGameChange = (e) => {
    const {
      target: { value },
    } = e;
    setDetails({ ...details, whatGame: value });
  };

  const handleFocus = (e) => {
    const {
      target: { id },
    } = e;
    if (id.includes('Color')) setFocusedInput(id.replace('Color', ''));
    else setFocusedInput('');
  };

  return (
    <>
      <h3>Story Details</h3>
      <div className="row">
        <label className="spacer" htmlFor={DETAILS_KEYS.LOCATION}>
          Location
        </label>
        <input
          type="text"
          id={DETAILS_KEYS.LOCATION}
          value={details[DETAILS_KEYS.LOCATION]}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>
      <div className="row">
        <label className="spacer" htmlFor={DETAILS_KEYS.AUTHOR}>
          Writer
        </label>
        <select
          id={DETAILS_KEYS.AUTHOR}
          defaultValue={details[DETAILS_KEYS.AUTHOR]}
          onChange={handleChange}
          onFocus={handleFocus}
        >
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>
      <div className="row label">
        <span className="spacer" />
        <label className="halfWidth" htmlFor={DETAILS_KEYS.TRANSLATOR}>
          Name
        </label>
        <label className="halfWidth" htmlFor={DETAILS_KEYS.TL_LINK}>
          Credit link (optional)
        </label>
      </div>
      <div className="row">
        <label className="spacer" htmlFor={DETAILS_KEYS.TRANSLATOR}>
          Translator
        </label>
        <input
          className="halfWidth"
          type="text"
          id={DETAILS_KEYS.TRANSLATOR}
          value={details[DETAILS_KEYS.TRANSLATOR]}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <input
          className="halfWidth"
          type="text"
          id={DETAILS_KEYS.TL_LINK}
          value={details[DETAILS_KEYS.TL_LINK]}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>
      <div className="row label">
        <span className="spacer" />
        <label className="halfWidth" htmlFor={DETAILS_KEYS.EDITOR}>
          Name
        </label>
        <label className="halfWidth" htmlFor={DETAILS_KEYS.ED_LINK}>
          Credit link (optional)
        </label>
      </div>
      <div className="row">
        <label className="spacer" htmlFor={DETAILS_KEYS.EDITOR}>
          Editor
        </label>
        <input
          className="halfWidth"
          type="text"
          id={DETAILS_KEYS.EDITOR}
          value={details[DETAILS_KEYS.EDITOR]}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <input
          className="halfWidth"
          type="text"
          id={DETAILS_KEYS.ED_LINK}
          value={details[DETAILS_KEYS.ED_LINK]}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>
      <div className="row">
        <label className="spacer" htmlFor={DETAILS_KEYS.WHAT_GAME}>
          Game
        </label>
        <input
          type="radio"
          name={DETAILS_KEYS.WHAT_GAME}
          value={GAME_OPTIONS.GAME2}
          id={GAME_OPTIONS.GAME2}
          checked={details[DETAILS_KEYS.WHAT_GAME] === GAME_OPTIONS.GAME2}
          onChange={handleGameChange}
          onFocus={handleFocus}
        />
        <label htmlFor={GAME_OPTIONS.GAME2}>ES!!</label>
        <input
          type="radio"
          name={DETAILS_KEYS.WHAT_GAME}
          value={GAME_OPTIONS.GAME1}
          id={GAME_OPTIONS.GAME1}
          checked={details[DETAILS_KEYS.WHAT_GAME] === GAME_OPTIONS.GAME1}
          onChange={handleGameChange}
          onFocus={handleFocus}
        />
        <label htmlFor={GAME_OPTIONS.GAME1}>ES!</label>
      </div>
      <ColorContent {...{ focusedInput, handleFocus }} />
    </>
  );
}

function ColorContent({ focusedInput, handleFocus }) {
  const { colors, setColors } = useContext(StateContext);

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
            {...{ label, color, handleColorChange, isFocused, handleFocus }}
          />
        );
      })}
    </>
  );
}

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

function ColorInput({
  label,
  color,
  handleColorChange,
  isFocused,
  handleFocus,
}) {
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
      <label className="spacer" htmlFor={`${label}Color`}>
        {label[0].toUpperCase() + label.slice(1, label.length)}
      </label>
      <input
        id={`${label}Color`}
        className="jscolor"
        spellCheck="false"
        value={color.toUpperCase()}
        style={{ backgroundColor: color, color: textColor }}
        onChange={handleInputChange}
        onFocus={handleFocus}
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
