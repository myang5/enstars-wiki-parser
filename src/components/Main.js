import React, { useState, useEffect } from 'react';
import TabMenu from './TabMenu';
import * as Tab from './TabContent/TabContent';

export default function Main() {
  const [buttonInfo] = useState({
    'Text': 'inputArea',
    'Details': 'detailArea',
    'Renders': 'renderArea',
    'TL Notes': 'tlArea',
  })
  const [clicked, setClicked] = useState('Text');

  return (
    <div id='mainContainer'>
      <div id="input">
        <TabMenu {...{ buttonInfo, clicked, setClicked }} />
        <Tab.InputArea clicked={buttonInfo[clicked]} />
        <Tab.DetailArea clicked={buttonInfo[clicked]} />

        {/*

      <!---RENDERTAB!--->
      <div id="renderArea" class="tabcontent">
        <p>
          Please paste in the file names of the dialogue renders as written in the wiki (ex. Tsukasa Suou School
          Dialogue Render.png)<br>
          (This tab will fill out once you paste dialogue into the Text tab)
        </p>
        <div id="renderForms"></div>
      </div>

      <!---TLNOTETAB!--->
      <div id="tlArea" class="tabcontent">
        <div id="tlEditor" class="editor">
          <p>If this is your first time using the formatter, please check the <a href='./howto.html#tlNotesSection'>Text
              Guidelines</a> for how to add translation notes.</p>
        </div>
      </div>*/}

      </div>

      {/*<div id="btnArea">
        <button onclick="convertText()" id="convertBtn">CONVERT</button>
        <button onclick="copyToClip()" id="copyBtn">Copy Output</button>
      </div>*/}

      <textarea id="output"></textarea>
    </div>
  )
}