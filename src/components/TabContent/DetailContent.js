import React, { useLayoutEffect } from 'react';
import '../../jscolor-2.0.5/jscolor.js';

export default function DetailContent() {

  // get values from localStorage before initial render to screen
  useLayoutEffect(() => {
    document.querySelector('#translator').value = localStorage.getItem('translator');
    document.querySelector('#tlLink').value = localStorage.getItem('tlLink');
    document.querySelector('#editor').value = localStorage.getItem('editor');
    document.querySelector('#edLink').value = localStorage.getItem('edLink');
  }, [])

  return (
    <>
      <h3>Story Details</h3>
      <div className="row">
        <label className='spacer' htmlFor="location">Location</label>
        <input type="text" id="location" />
      </div>
      <div className="row">
        <label className='spacer' htmlFor="author">Writer</label>
        <select id="author">
          <option>日日日 (Akira)</option>
          <option>結城由乃 (Yuuki Yoshino)</option>
          <option>西岡麻衣子 (Nishioka Maiko)</option>
          <option>ゆーます (Yuumasu)</option>
          <option>木野誠太郎 (Kino Seitaro)</option>
          <option>Happy Elements株式会社 (Happy Elements K.K)</option>
        </select>
      </div>
      <div className="row label">
        <span className="spacer"></span>
        <label className="halfWidth" htmlFor="translator">Name</label>
        <label className="halfWidth" htmlFor="tlLink">Credit link (optional)</label>
      </div>
      <div className="row">
        <label className='spacer' htmlFor="translator">Translator</label>
        <input className="halfWidth" type="text" id="translator" />
        <input className="halfWidth" type="text" id="tlLink" />
      </div>
      <div className="row label">
        <span className="spacer"></span>
        <label className="halfWidth" htmlFor="editor">Name</label>
        <label className="halfWidth" htmlFor="edLink">Credit link (optional)</label>
      </div>
      <div className="row">
        <label className='spacer' htmlFor="editor">Editor</label>
        <input className="halfWidth" type="text" id="editor" />
        <input className="halfWidth" type="text" id="edLink" />
      </div>
      <h3>Heading Colors</h3>
      <div id='colorinputs'>
        {
          ['writer', 'location', 'bottom', 'text'].map(
            label => <ColorInput key={label} label={label} />
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
      <input className="jscolor {width:101, padding:0, shadow:false, borderWidth:0, backgroundColor:'transparent', position:'right'}"
        spellCheck='false'
        name={props.label + 'Col'} />
    </div>
  )
}