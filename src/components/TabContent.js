import React from 'react';
import { InputEditor } from './CKEditor';
import '../jscolor-2.0.5/jscolor.js';

function TabContent(props) {
  return (
    //need tabContent classname so that tabs can show/hide divs appropriately
    <div className='tabContent' id={`${props.type}Area`}>
      {props.content}
    </div>
  )
}

export function InputArea() {
  const content = <InputEditor />;
  return <TabContent type='input' content={content} />
}