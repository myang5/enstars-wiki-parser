import React, { useState, useContext, useRef } from 'react';
import { StateProvider, StateContext } from './StateContext';
import TabMenu from './TabComponents/TabMenu';
import TabContent from './TabComponents/TabContent';
import { InputEditor } from './TabComponents/CKEditor';
import DetailContent from './TabComponents/DetailContent';
import RenderContent from './TabComponents/RenderContent';
import TLNotesContent from './TabComponents/TLNotesContent';
import { convertText } from '../util/convertText';

export default function Main() {
  const outputRef = useRef(null);

  return (
    <StateProvider>
      <div id='mainContainer'>
        <Input />
        <Buttons {...{ outputRef }} />
        <textarea id="output" ref={outputRef} spellCheck={false}></textarea>
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

const Buttons = ({ outputRef }) => {
  const { details, renders, inputRef, tlNotesRef } = useContext(StateContext);
  const [copyButton, setCopyButton] = useState('Copy Output');
  const [error, setError] = useState('');

  // copies text to clipboard
  const copyToClip = () => {
    outputRef.current.select();
    document.execCommand("copy");
    setCopyButton('Copied');
  }

  const convertOnClick = () => {
    setCopyButton('Copy Output');
    setError('');
    const output = convertText(
      inputRef.current.editor.getData(),
      tlNotesRef.current.editor.getData(),
      Object.keys(renders),
      details
    );
    outputRef.current.value = output;
  }

  return (
    <div id="btnArea">
      <button onClick={convertOnClick} id="convertBtn">CONVERT</button>
      <button onClick={copyToClip} id="copyBtn">{copyButton}</button>
      <p className='error'>{error}</p>
    </div>
  )
};
