import React, { useContext } from 'react';
import { StateContext } from '../Main/StateContext';
import { NAME_LINKS } from 'Constants';

export default function RenderContent() {
  const { renderRef, renders, setRenders } = useContext(StateContext);

  const handleChange = (e) => {
    const newState = { ...renders, [e.target.id]: e.target.value };
    renderRef.current = newState;
    setRenders(newState);
  };

  return (
    <>
      <p>
        Please paste in the file names of the dialogue renders as written in the
        wiki (ex. Tsukasa Suou School Dialogue Render.png)
        <br />
        (This tab will fill out once you paste dialogue into the Text tab)
      </p>
      <div id="renderForms">
        {Object.entries(renders).map(([name, render]) => (
          <RenderRow
            key={name}
            name={name}
            value={render}
            link={NAME_LINKS[name.toUpperCase()]}
            onChange={handleChange}
          />
        ))}
      </div>
    </>
  );
}

function RenderRow({ name, link, value, onChange }) {
  return (
    <div className="row">
      <label htmlFor={name} className="row__spacer">
        <RenderLink link={link} name={name} />
      </label>
      <input id={name} onChange={onChange} value={value} />
    </div>
  );
}

function RenderLink({ name, link }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={`http://ensemble-stars.wikia.com/wiki/${link}/Gallery#Render`}
    >
      {name}
    </a>
  );
}
