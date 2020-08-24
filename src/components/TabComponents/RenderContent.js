import React, { useContext } from 'react';
import { StateContext } from '../StateContext';
import { NAME_LINKS } from '../../util/data';

export default function RenderContent() {
  const { renderRef, setRenders } = useContext(StateContext);

  const handleChange = (e) => {
    const newState = { ...renderRef.current, [e.target.id]: e.target.value };
    renderRef.current = newState;
    setRenders(newState);
  };

  return (
    <>
      <p>
        Please paste in the file names of the dialogue renders as written in the wiki (ex. Tsukasa Suou School Dialogue Render.png)
        <br />
        (This tab will fill out once you paste dialogue into the Text tab)
      </p>
      <div id='renderForms'>
        {Object.keys(renderRef.current).map(name =>
          <RenderRow key={name}
            name={name}
            value={renderRef.current[name]}
            link={NAME_LINKS[name.toUpperCase()]}
            handleChange={handleChange} />
        )}
      </div>
    </>
  );
}

function RenderRow(props) {
  return (
    <div className='row'>
      <label className='spacer'>
        <RenderLink link={props.link} name={props.name} />
      </label>
      <input id={props.name} onChange={props.handleChange} value={props.value} />
    </div>
  )
}

function RenderLink(props) {
  return (
    <a href={`http://ensemble-stars.wikia.com/wiki/${props.link}/Gallery#Render`} target='_blank'>
      {props.name}
    </a>
  )
}