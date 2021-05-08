import React, { useState, useContext, useRef } from 'react';
import { StateProvider, StateContext } from './StateContext';
import {
  TabMenu,
  TabContent,
  InputEditor,
  NavContent,
  DetailContent,
  RenderContent,
  TLNotesContent,
} from '../TabComponents';
import convertText from 'Utils/convertText';
import './Main.less';

const TABS = {
  TEXT: 'Text',
  NAV: 'Story Nav',
  DETAILS: 'Details',
  RENDERS: 'Renders',
  TL_NOTES: 'TL Notes',
};
const tabTitles = Object.values(TABS);

export default function Main() {
  const outputRef = useRef(null);

  return (
    <StateProvider>
      <div className="main-page">
        <Input />
        <Buttons {...{ outputRef }} />
        <textarea className="output" ref={outputRef} spellCheck={false} />
      </div>
    </StateProvider>
  );
}

const Input = () => {
  const [clicked, setClicked] = useState(TABS.TEXT);

  return (
    <div className="input">
      <TabMenu {...{ tabs: tabTitles, clicked, onClick: setClicked }} />
      <TabContent {...{ value: TABS.TEXT, clicked }}>
        <InputEditor />
      </TabContent>
      <TabContent {...{ value: TABS.NAV, clicked }}>
        <NavContent />
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
  const {
    nav,
    details,
    setDetails,
    colors,
    renders,
    inputRef,
    tlNotesRef,
  } = useContext(StateContext);
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
      nav,
      renders,
      details,
      onChangeDetails: setDetails,
      colors,
    });
    outputRef.current.value = output;
  };

  return (
    <div className="actions">
      <button type="button" onClick={convertOnClick} id="convert-button">
        CONVERT
      </button>
      <button type="button" onClick={copyToClip} id="copy-button">
        {copyButton}
      </button>
      <p className="error">{error}</p>
    </div>
  );
};
