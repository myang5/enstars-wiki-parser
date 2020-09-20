import React, { useState, useContext } from 'react';
import { StateContext } from '../StateContext';
import { ChromePicker } from './react-color';

export default function DetailContent() {
  const { details, setDetails } = useContext(StateContext);
  const [focusedInput, setFocusedInput] = useState('');

  const handleChange = e => {
    const {
      target: { id, value },
    } = e;
    if (id === 'ES!!' || id === 'ES!') {
      setDetails({ ...details, whatGame: value });
    } else setDetails({ ...details, [id]: value });
  };

  const handleFocus = e => {
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
        <label className="spacer" htmlFor="location">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={details.location}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>
      <div className="row">
        <label className="spacer" htmlFor="author">
          Writer
        </label>
        <select
          id="author"
          defaultValue={details.author}
          onChange={handleChange}
          onFocus={handleFocus}
        >
          <option value="日日日 (Akira)">日日日 (Akira)</option>
          <option value="結城由乃 (Yuuki Yoshino)">結城由乃 (Yuuki Yoshino)</option>
          <option value="西岡麻衣子 (Nishioka Maiko)">西岡麻衣子 (Nishioka Maiko)</option>
          <option value="ゆーます (Yuumasu)">ゆーます (Yuumasu)</option>
          <option value="木野誠太郎 (Kino Seitaro)">木野誠太郎 (Kino Seitaro)</option>
          <option value="Happy Elements株式会社 (Happy Elements K.K)">
            Happy Elements株式会社 (Happy Elements K.K)
          </option>
        </select>
      </div>
      <div className="row label">
        <span className="spacer" />
        <label className="halfWidth" htmlFor="translator">
          Name
        </label>
        <label className="halfWidth" htmlFor="tlLink">
          Credit link (optional)
        </label>
      </div>
      <div className="row">
        <label className="spacer" htmlFor="translator">
          Translator
        </label>
        <input
          className="halfWidth"
          type="text"
          id="translator"
          value={details.translator}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <input
          className="halfWidth"
          type="text"
          id="tlLink"
          value={details.tlLink}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>
      <div className="row label">
        <span className="spacer" />
        <label className="halfWidth" htmlFor="editor">
          Name
        </label>
        <label className="halfWidth" htmlFor="edLink">
          Credit link (optional)
        </label>
      </div>
      <div className="row">
        <label className="spacer" htmlFor="editor">
          Editor
        </label>
        <input
          className="halfWidth"
          type="text"
          id="editor"
          value={details.editor}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <input
          className="halfWidth"
          type="text"
          id="edLink"
          value={details.edLink}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>
      <div className="row">
        <label className="spacer" htmlFor="whatGame">
          Game
        </label>
        <input
          type="radio"
          name="whatGame"
          value="Story !!"
          id="ES!!"
          checked={details.whatGame === 'Story !!'}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <label htmlFor="ES!!">ES!!</label>
        <input
          type="radio"
          name="whatGame"
          value="Story"
          id="ES!"
          checked={details.whatGame === 'Story'}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <label htmlFor="ES!">ES!</label>
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

function ColorInput({ label, color, handleColorChange, isFocused, handleFocus }) {
  const [isColorPickerShowing, setColorPickerShowing] = useState(false);
  const [textColor, setTextColor] = useState('#000');

  // const handleFocus = () => {
  //   setColorPickerShowing(true);
  // };

  const normalizeHex = str => {
    return str[0] === '#' ? str.toUpperCase() : '#' + str.toUpperCase();
  };

  const hexToHSL = hex => {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length == 4) {
      r = '0x' + hex[1] + hex[1];
      g = '0x' + hex[2] + hex[2];
      b = '0x' + hex[3] + hex[3];
    } else if (hex.length == 7) {
      r = '0x' + hex[1] + hex[2];
      g = '0x' + hex[3] + hex[4];
      b = '0x' + hex[5] + hex[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +s.toFixed(2);
    l = +l.toFixed(2);

    return { h, s, l };
  };

  const handleInputChange = e => {
    const {
      target: { value },
    } = e;
    const normalized = normalizeHex(value);
    handleColorChange(label, normalized);
    console.log(normalized);
    if (normalized.length === 4 || normalized.length === 7) {
      const { l } = hexToHSL(normalized);
      console.log(l);
      setTextColor(l > 0.6 ? '#000' : '#fff');
    }
  };

  const handlePickerChange = color => {
    const {
      hex,
      hsl: { l },
    } = color;
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
      {/* TODO: toggle ColorPicker properly when clicking out of clicking out of input*/}
      {isFocused && (
        <ChromePicker color={color} onChange={handlePickerChange} disableAlpha={true} />
      )}
    </div>
  );
}
