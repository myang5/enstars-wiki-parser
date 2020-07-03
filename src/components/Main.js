import React, { useState, useRef } from 'react';
import EditorContext from './EditorContext';
import TabMenu from './TabMenu';
import * as Tab from './TabContent/TabContent';
import { getNamesInDialogue } from '../convertText/convertText';

export default function Main() {
  const [buttonInfo] = useState({
    'Text': 'inputArea',
    'Details': 'detailArea',
    'Renders': 'renderArea',
    'TL Notes': 'tlArea',
  })
  const [clicked, setClicked] = useState('Text');
  const [names, setNames] = useState(new Set());

  // create refs for each CKEditor to pass into EditorContext
  const inputRef = useRef(null);
  const tlNotesRef = useRef(null);
  const refs = { inputRef, tlNotesRef };

  // copies text to clipboard
  const copyToClip = () => {
    document.querySelector('#output').select();
    document.execCommand("copy");
    document.querySelector('#copyBtn').innerHTML = 'Copied';
  }

  // updates the dialogue render inputs when content of InputArea changes
  const updateNames = (editor) => {
    const names = getNamesInDialogue(editor);
    setNames(names);
  }

  return (
    // value of EditorContext.Provider will be available to all child components
    // through useContext hook
    <EditorContext.Provider value={refs}>
      <div id='mainContainer'>
        <div id="input">
          <TabMenu {...{ buttonInfo, clicked, setClicked }} />
          {/* clicked prop determines which TabContent is visible */}
          {/* all TabContent is "rendered" to preserve user input, just not painted to screen */}
          <Tab.InputArea clicked={buttonInfo[clicked]} {...{ updateNames }} />
          <Tab.DetailArea clicked={buttonInfo[clicked]} />
          <Tab.RenderArea clicked={buttonInfo[clicked]} {...{ names }} />
          <Tab.TLNotesArea clicked={buttonInfo[clicked]} />
        </div>

        <div id="btnArea">
          <button id="convertBtn">CONVERT</button>
          <button onClick={copyToClip} id="copyBtn">Copy Output</button>
        </div>

        <textarea id="output"></textarea>

      </div>
    </EditorContext.Provider>
  )
}