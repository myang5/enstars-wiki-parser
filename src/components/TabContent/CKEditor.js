import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
//import List from '@ckeditor/ckeditor5-list/src/list.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';

const inputEditorConfig = {
  plugins: [Bold, Italic, Link, PasteFromOffice, Essentials, Paragraph],
  toolbar: ['bold', 'italic', 'link', '|', 'undo', 'redo']
};

//const tlNotesEditorConfig = {
//  plugins: [Bold, Italic, Link, List, PasteFromOffice, Essentials, Paragraph],
//  toolbar: ['bold', 'italic', 'link', 'numberedList', '|', 'undo', 'redo']
//};

export function InputEditor() {
  const data = (
    `<p>If this is your first time using the formatter, please check the <a href='/#/howto'>Text Guidelines</a> to make
        sure your text is ready.</p>
      <p>---EXAMPLE DIALOGUE---</p>
      <p>The header image.png</p>
      <p><strong>Person A:</strong> This is a line said by Person A! Their line starts with their name followed by a colon.</p>
      <p><strong>Person B:</strong> This is a line said by another person!</p>
      <p>Heading: Location: Hallway (will format to "Location: Hallway")</p>
      <p>A screenshot of the game.jpeg</p>
      <p><strong>Person A:</strong> Another line from Person A.</p>`
  );
  console.log('InputEditor render');
  return (
    <CKEditor
      editor={BalloonEditor}
      config={inputEditorConfig}
      data={data}
      id='inputEditor'
      spellcheck='false'
    //onChange={(event, editor) => {
    //  const data = editor.getData();
    //  this.setState({ input: data });
    //}}
    />
  );
}

//export function TLNotesEditor() {
//  return (
//    <CKEditor
//      editor={BalloonEditor}
//      config={tlNotesEditorConfig}
//      data={data}
//      id='tlEditor'
//      spellcheck={false}
//      //onChange={(event, editor) => {
//      //  const data = editor.getData();
//      //  this.setState({ tlNotes: data });
//      //}}
//    />
//  )
//}
