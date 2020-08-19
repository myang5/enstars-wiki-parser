import React, { useContext } from 'react';
import { StateContext } from '../StateContext';
import '../../jscolor-2.0.5/jscolor.js';

export default function DetailContent() {
  const { details, setDetails } = useContext(StateContext);
  
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.id]: e.target.value });
  };

  return (
    <>
      <h3>Story Details</h3>
      <div className="row">
        <label className='spacer' htmlFor="location">Location</label>
        <input type="text" id="location" value={details.location} onChange={handleChange} />
      </div>
      <div className="row">
        <label className='spacer' htmlFor="author">Writer</label>
        <select id="author" defaultValue={details.author} onChange={handleChange}>
          <option value='日日日 (Akira)'>日日日 (Akira)</option>
          <option value='結城由乃 (Yuuki Yoshino)'>結城由乃 (Yuuki Yoshino)</option>
          <option value='西岡麻衣子 (Nishioka Maiko)'>西岡麻衣子 (Nishioka Maiko)</option>
          <option value='ゆーます (Yuumasu)'>ゆーます (Yuumasu)</option>
          <option value='木野誠太郎 (Kino Seitaro)'>木野誠太郎 (Kino Seitaro)</option>
          <option value='Happy Elements株式会社 (Happy Elements K.K)'>Happy Elements株式会社 (Happy Elements K.K)</option>
        </select>
      </div>
      <div className="row label">
        <span className="spacer"></span>
        <label className="halfWidth" htmlFor="translator">Name</label>
        <label className="halfWidth" htmlFor="tlLink">Credit link (optional)</label>
      </div>
      <div className="row">
        <label className='spacer' htmlFor="translator">Translator</label>
        <input className="halfWidth" type="text" id="translator" value={details.translator} onChange={handleChange} />
        <input className="halfWidth" type="text" id="tlLink" value={details.tlLink} onChange={handleChange} />
      </div>
      <div className="row label">
        <span className="spacer"></span>
        <label className="halfWidth" htmlFor="editor">Name</label>
        <label className="halfWidth" htmlFor="edLink">Credit link (optional)</label>
      </div>
      <div className="row">
        <label className='spacer' htmlFor="editor">Editor</label>
        <input className="halfWidth" type="text" id="editor" value={details.editor} onChange={handleChange} />
        <input className="halfWidth" type="text" id="edLink" value={details.edLink} onChange={handleChange} />
      </div>
      <h3>Heading Colors</h3>
      <div id='colorinputs'>
        {
          ['writer', 'location', 'bottom', 'text'].map(
            label => <ColorInput {...{ key: label, label, details, handleChange }} />
          )
        }
      </div>
    </>
  );
}

function ColorInput(props) {
  return (
    <div className='row'>
      <label className='spacer'>{props.label[0].toUpperCase() + props.label.slice(1, props.label.length)}</label>
      <input
        className="jscolor {width:101, padding:0, shadow:false, borderWidth:0, backgroundColor:'transparent', position:'right'}"
        spellCheck='false'
        id={props.label + 'Col'} />
    </div>
  )
}