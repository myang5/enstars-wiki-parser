import React, { useState, useContext, useRef } from 'react';
import { StateProvider, StateContext } from './StateContext';
import TabMenu from './TabComponents/TabMenu';
import TabContent from './TabComponents/TabContent';
import { InputEditor } from './TabComponents/CKEditor';
import DetailContent from './TabComponents/DetailContent';
import RenderContent from './TabComponents/RenderContent';
import TLNotesContent from './TabComponents/TLNotesContent';
import convertText from '../utils/convertText';

const TABS = {
  TEXT: 'Text',
  DETAILS: 'Details',
  RENDERS: 'Renders',
  TL_NOTES: 'TL Notes',
};
const tabTitles = Object.values(TABS);

export default function Main() {
  const outputRef = useRef(null);

  return (
    <StateProvider>
      <div id="mainContainer">
        <Input />
        <Buttons {...{ outputRef }} />
        <textarea id="output" ref={outputRef} spellCheck={false} />
      </div>
    </StateProvider>
  );
}

const Input = () => {
  const [clicked, setClicked] = useState(TABS.TEXT);

  return (
    <div id="input">
      <TabMenu {...{ tabs: tabTitles, clicked, onClick: setClicked }} />
      <TabContent {...{ value: TABS.TEXT, clicked }}>
        <InputEditor />
      </TabContent>
      <TabContent {...{ value: TABS.DETAILS, clicked }}>
        <DetailContent />
      </TabContent>
      <TabContent {...{ value: TABS.RENDERS, clicked }}>
        <RenderContent />
      </TabContent>
      <TabContent {...{ value: TABS.TL_NOTES, clicked }}>
        <TLNotesContent />
      </TabContent>
    </div>
  );
};

const COPY_BUTTON_TEXT = {
  COPY: 'Copy Output',
  COPIED: 'Copied',
};

const Buttons = ({ outputRef }) => {
  const { details, colors, renders, inputRef, tlNotesRef } = useContext(
    StateContext
  );
  const [copyButton, setCopyButton] = useState(COPY_BUTTON_TEXT.COPY);
  const [error, setError] = useState('');

  // copies text to clipboard
  const copyToClip = () => {
    outputRef.current.select();
    document.execCommand('copy');
    setCopyButton(COPY_BUTTON_TEXT.COPIED);
  };

  const convertOnClick = () => {
    setCopyButton(COPY_BUTTON_TEXT.COPY);
    setError('');
    const output = convertText({
      inputData: inputRef.current.editor.getData(),
      tlNotesData: tlNotesRef.current.editor.getData(),
      renders,
      details,
      colors,
    });
    outputRef.current.value = output;
  };

  return (
    <div id="btnArea">
      <button type="button" onClick={convertOnClick} id="convertBtn">
        CONVERT
      </button>
      <button type="button" onClick={copyToClip} id="copyBtn">
        {copyButton}
      </button>
      <p className="error">{error}</p>
    </div>
  );
};
