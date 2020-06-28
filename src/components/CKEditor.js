import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';

const inputEditorConfig = {
  plugins: [Bold, Italic, Link, PasteFromOffice, Essentials, Paragraph],
  toolbar: ['bold', 'italic', 'link', '|', 'undo', 'redo']
};

const tlNotesEditorConfig = {
  plugins: [Bold, Italic, Link, List, PasteFromOffice, Essentials, Paragraph],
  toolbar: ['bold', 'italic', 'link', 'numberedList', '|', 'undo', 'redo']
};

export function InputEditor() {
  return (
    <CKEditor
      editor={BalloonEditor}
      config={inputEditorConfig}
      data={this.state.input}
      id='inputEditor'
      spellcheck='false'
      //onChange={(event, editor) => {
      //  const data = editor.getData();
      //  this.setState({ input: data });
      //}}
    />
  );
}

export function TLNotesEditor() {
  return (
    <CKEditor
      editor={BalloonEditor}
      config={tlNotesEditorConfig}
      data={this.state.tlNotes}
      id='tlEditor'
      spellcheck={false}
      //onChange={(event, editor) => {
      //  const data = editor.getData();
      //  this.setState({ tlNotes: data });
      //}}
    />
  )
}
