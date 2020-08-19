import React, { useState, useContext } from 'react';
import { StateProvider, StateContext } from './StateContext';
import TabMenu from './TabComponents/TabMenu';
import TabContent from './TabComponents/TabContent';
import { InputEditor } from './TabComponents/CKEditor';
import DetailContent from './TabComponents/DetailContent';
import RenderContent from './TabComponents/RenderContent';
import TLNotesContent from './TabComponents/TLNotesContent';
import { convertText } from '../convertText/convertText';

export default function Main() {
  return (
    <StateProvider>
      <div id='mainContainer'>
        <Input />
        <Buttons />
        <textarea id="output"></textarea>
      </div>
    </StateProvider>
  )
}

const Input = () => {
  const [tabs,] = useState(['Text', 'Details', 'Renders', 'TL Notes']);
  const [clicked, setClicked] = useState('Text');

  return (
    <div id="input">
      <TabMenu {...{ tabs, clicked, setClicked }} />
      <TabContent {...{ value: 'Text', clicked }}>
        <InputEditor />
      </TabContent>
      <TabContent {...{ value: 'Details', clicked }}>
        <DetailContent />
      </TabContent>
      <TabContent {...{ value: 'Renders', clicked }}>
        <RenderContent />
      </TabContent>
      <TabContent {...{ value: 'TL Notes', clicked }}>
        <TLNotesContent />
      </TabContent>
    </div>
  )
};

const Buttons = () => {
  const { details, renders, inputRef, tlNotesRef } = useContext(StateContext);
  
  // copies text to clipboard
  const copyToClip = () => {
    document.querySelector('#output').select();
    document.execCommand("copy");
    document.querySelector('#copyBtn').innerHTML = 'Copied';
  }

  const convertOnClick = () => {
    convertText(
      inputRef.current.editor,
      tlNotesRef.current.editor,
      Object.keys(renders),
      details
    );
  }

  return (
    <div id="btnArea">
      <button onClick={convertOnClick} id="convertBtn">CONVERT</button>
      <button onClick={copyToClip} id="copyBtn">Copy Output</button>
      <p className='error'></p>
    </div>
  )
};
