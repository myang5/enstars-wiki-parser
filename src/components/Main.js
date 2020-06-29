import React from 'react';
import TabMenu from './TabMenu';
import { InputArea } from './TabContent';

export default function Main() {
  console.log('Main render');
  return (
    <div className='mainContainer'>
      <div id="input">
        <TabMenu />
        <InputArea />

        {/*

      <!---DETAILS TAB!--->
      <div id="detailArea" class="tabcontent">

        <h3>Story Details</h3>
        <div class="row">
          <label class='spacer' for="location">Location</label>
          <input type="text" id="location">
        </div>

        <div class="row">
          <label class='spacer' for="author">Writer</label>
          <select id="author">
            <option>日日日 (Akira)</option>
            <option>結城由乃 (Yuuki Yoshino)</option>
            <option>西岡麻衣子 (Nishioka Maiko)</option>
            <option>ゆーます (Yuumasu)</option>
            <option>木野誠太郎 (Kino Seitaro)</option>
            <option>Happy Elements株式会社 (Happy Elements K.K)</option>
          </select>
        </div>
        <div class="row label">
          <span class="spacer"></span>
          <label class="halfWidth" for="translator">Name</label>
          <label class="halfWidth" for="tlLink">Credit link (optional)</label>
        </div>
        <div class="row">
          <label class='spacer' for="translator">Translator</label>
          <input class="halfWidth" type="text" id="translator">
          <input class="halfWidth" type="text" id="tlLink">
        </div>
        <div class="row label">
          <span class="spacer"></span>
          <label class="halfWidth" for="editor">Name</label>
          <label class="halfWidth" for="edLink">Credit link (optional)</label>
        </div>
        <div class="row">
          <label class='spacer' for="editor">Editor</label>
          <input class="halfWidth" type="text" id="editor">
          <input class="halfWidth" type="text" id="edLink">
        </div>
        <h3>Heading Colors</h3>
        <div id='colorinputs'></div></div>

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