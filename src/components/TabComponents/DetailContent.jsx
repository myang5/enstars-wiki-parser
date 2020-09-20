import React, { useState, useContext } from 'react';
import { StateContext } from '../StateContext';
import { ChromePicker } from './react-color';

export default function DetailContent() {
  const { details, setDetails } = useContext(StateContext);

  const handleChange = e => {
    const {
      target: { id, value },
    } = e;
    if (id === 'ES!!' || id === 'ES!') {
      setDetails({ ...details, whatGame: value });
    } else setDetails({ ...details, [id]: value });
  };

  return (
    <>
      <h3>Story Details</h3>
      <div className="row">
        <label className="spacer" htmlFor="location">
          Location
        </label>
        <input type="text" id="location" value={details.location} onChange={handleChange} />
      </div>
      <div className="row">
        <label className="spacer" htmlFor="author">
          Writer
        </label>
        <select id="author" defaultValue={details.author} onChange={handleChange}>
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
        />
        <input
          className="halfWidth"
          type="text"
          id="tlLink"
          value={details.tlLink}
          onChange={handleChange}
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
        />
        <input
          className="halfWidth"
          type="text"
          id="edLink"
          value={details.edLink}
          onChange={handleChange}
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
        />
        <label htmlFor="ES!!">ES!!</label>
        <input
          type="radio"
          name="whatGame"
          value="Story"
          id="ES!"
          checked={details.whatGame === 'Story'}
          onChange={handleChange}
        />
        <label htmlFor="ES!">ES!</label>
      </div>
      <ColorContent />
    </>
  );
}

function ColorContent() {
  const { colors, setColors } = useContext(StateContext);

  const handleColorChange = (name, value) => {
    setColors({ ...colors, [name]: value });
  };

  return (
    <>
      <h3>Heading Colors</h3>
      {Object.entries(colors).map(([label, color]) => (
        <ColorInput key={label} {...{ label, color, handleColorChange }} />
      ))}
    </>
  );
}

function ColorInput({ label, color, handleColorChange }) {
  const [isColorPickerShowing, setColorPickerShowing] = useState(false);
  const [textColor, setTextColor] = useState('#000');

  const handleFocus = () => {
    setColorPickerShowing(true);
  };

  const handleInputChange = e => {
    const {
      target: { value },
    } = e;
    handleColorChange(label, value);
  };

  const handlePickerChange = color => {
    const { hex, hsl: { l } } = color;
    handleColorChange(label, hex);
    setTextColor(l > 0.60 ? '#000' : '#fff');
  };

  return (
    <div className="row">
      <label className="spacer">{label[0].toUpperCase() + label.slice(1, label.length)}</label>
      <input
        className="jscolor"
        spellCheck="false"
        value={color.toUpperCase()}
        style={{ backgroundColor: color, color: textColor }}
        onChange={handleInputChange}
        onFocus={handleFocus}
      />
      {/* TODO: toggle ColorPicker by focusing on input and then clicking out of input*/}
      {isColorPickerShowing && <ChromePicker color={color} onChange={handlePickerChange} disableAlpha={true} />}
    </div>
  );
  // return (
  //   <div>
  //     <div style={styles.swatch} onClick={this.handleClick}>
  //       <div style={styles.color} />
  //     </div>
  //     {this.state.displayColorPicker ? (
  //       <div style={styles.popover}>
  //         <div style={styles.cover} onClick={this.handleClose} />
  //         <SketchPicker color={this.state.color} onChange={this.handleChange} />
  //       </div>
  //     ) : null}
  //   </div>
  // );
}