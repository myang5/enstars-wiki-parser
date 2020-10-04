import React, { useContext } from 'react';
import { StateContext } from '../StateContext';
import NAME_LINKS from '../../util/name_links';

export default function RenderContent() {
  const { renderRef, setRenders } = useContext(StateContext);

  const handleChange = e => {
    const newState = { ...renderRef.current, [e.target.id]: e.target.value };
    renderRef.current = newState;
    setRenders(newState);
  };

  return (
    <>
      <p>
        Please paste in the file names of the dialogue renders as written in the wiki (ex. Tsukasa
        Suou School Dialogue Render.png)
        <br />
        (This tab will fill out once you paste dialogue into the Text tab)
      </p>
      <div id="renderForms">
        {Object.keys(renderRef.current).map(name => (
          <RenderRow
            key={name}
            name={name}
            value={renderRef.current[name]}
            link={NAME_LINKS[name.toUpperCase()]}
            handleChange={handleChange}
          />
        ))}
      </div>
    </>
  );
}

function RenderRow({ name, link, value, handleChange }) {
  return (
    <div className="row">
      <label htmlFor={name} className="spacer">
        <RenderLink link={link} name={name} />
      </label>
      <input id={name} onChange={handleChange} value={value} />
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
