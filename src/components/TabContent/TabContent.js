import React from 'react';
import { InputEditor } from './CKEditor';
import DetailContent from './DetailContent';
import RenderForms from './RenderContent';
import '../../jscolor-2.0.5/jscolor.js';

function TabContent(props) {
  return (
    <div className={`tabContent${props.clicked === props.type ? ' active' : ''}`} id={props.type} >
      {props.content}
    </div>
  );
}

export function InputArea(props) {
  const content = <InputEditor />
  return <TabContent type='inputArea' content={content} clicked={props.clicked} />
}

export function DetailArea(props) {
  const content = <DetailContent />
  return <TabContent type='detailArea' content={content} clicked={props.clicked} />
}

export function RenderArea(props) {
  const content = <RenderForms />
  return <TabContent type='renderArea' content={content} clicked={props.clicked} />
}