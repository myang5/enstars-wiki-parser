import React from 'react';
import { InputEditor } from './CKEditor';
import DetailContent from './DetailContent';
import RenderContent from './RenderContent';
import TLNotesContent from './TLNotesContent';

function TabContent(props) {
  return (
    // set className so that CSS controls which TabContent is visible
    <div className={`tabContent${props.clicked === props.type ? ' active' : ''}`} id={props.type} >
      {props.content}
    </div>
  );
}

export function InputArea(props) {
  const content = <InputEditor updateNames={props.updateNames} />
  return <TabContent type='inputArea' content={content} clicked={props.clicked} />
}

export function DetailArea(props) {
  const content = <DetailContent />
  return <TabContent type='detailArea' content={content} clicked={props.clicked} />
}

export function RenderArea(props) {
  const content = <RenderContent names={props.names} />
  return <TabContent type='renderArea' content={content} clicked={props.clicked} />
}

export function TLNotesArea(props) {
  const content = <TLNotesContent />
  return <TabContent type='tlArea' content={content} clicked={props.clicked} />
}