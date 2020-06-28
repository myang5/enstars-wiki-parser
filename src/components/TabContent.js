import React from 'react';
import { Link } from 'react-router-dom';
import { InputEditor, TLNotesEditor} from './CKEditor';
import '../jscolor-2.0.5/jscolor.js';

function TabContent(props) {
  return (
    <div className='tabContent' id={`${props.type}Area`}>
      {props.content}
    </div>
  )
}

export function InputArea() {
  const content = (
    <div id="inputEditor" className="editor">
      <p>If this is your first time using the formatter, please check the <Link to='/howto'>Text Guidelines</Link> to make
        sure your text is ready.</p>
      <p>---EXAMPLE DIALOGUE---</p>
      <p>The header image.png</p>
      <p><strong>Person A:</strong> This is a line said by Person A! Their line starts with their name followed by a colon.</p>
      <p><strong>Person B:</strong> This is a line said by another person!</p>
      <p>Heading: Location: Hallway (will format to "Location: Hallway")</p>
      <p>A screenshot of the game.jpeg</p>
      <p><strong>Person A:</strong> Another line from Person A.</p>
    </div>
  );
  return <TabContent type='input' content={content} />
}