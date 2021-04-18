import React, { useContext } from 'react';
import { StateContext } from '../Main/StateContext';
import { AUTHOR_NAMES, DETAILS_KEYS, GAME_OPTIONS } from 'Constants';

const authors = Object.values(AUTHOR_NAMES);

export default function DetailContent() {
  const { details, setDetails } = useContext(StateContext);

  const handleChange = (e) => {
    const {
      target: { id, value },
    } = e;
    setDetails({ ...details, [id]: value });
  };

  const handleGameChange = (e) => {
    const {
      target: { value },
    } = e;
    setDetails({ ...details, whatGame: value });
  };

  return (
    <>
      <h3>Story Details</h3>
      <div className="row">
        <label className="row__spacer" htmlFor={DETAILS_KEYS.LOCATION}>
          Location
        </label>
        <input
          type="text"
          id={DETAILS_KEYS.LOCATION}
          value={details[DETAILS_KEYS.LOCATION]}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor={DETAILS_KEYS.AUTHOR}>
          Writer
        </label>
        <select
          id={DETAILS_KEYS.AUTHOR}
          defaultValue={details[DETAILS_KEYS.AUTHOR]}
          onChange={handleChange}
        >
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>
      <div className="row row--label-only">
        <span className="row__spacer" />
        <label className="row__half-width" htmlFor={DETAILS_KEYS.TRANSLATOR}>
          Name
        </label>
        <label className="row__half-width" htmlFor={DETAILS_KEYS.TL_LINK}>
          Credit link (optional)
        </label>
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor={DETAILS_KEYS.TRANSLATOR}>
          Translator
        </label>
        <input
          className="row__half-width"
          type="text"
          id={DETAILS_KEYS.TRANSLATOR}
          value={details[DETAILS_KEYS.TRANSLATOR]}
          onChange={handleChange}
        />
        <input
          className="row__half-width"
          type="text"
          id={DETAILS_KEYS.TL_LINK}
          value={details[DETAILS_KEYS.TL_LINK]}
          onChange={handleChange}
        />
      </div>
      <div className="row row--label-only">
        <span className="row__spacer" />
        <label className="row__half-width" htmlFor={DETAILS_KEYS.EDITOR}>
          Name
        </label>
        <label className="row__half-width" htmlFor={DETAILS_KEYS.ED_LINK}>
          Credit link (optional)
        </label>
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor={DETAILS_KEYS.EDITOR}>
          Editor
        </label>
        <input
          className="row__half-width"
          type="text"
          id={DETAILS_KEYS.EDITOR}
          value={details[DETAILS_KEYS.EDITOR]}
          onChange={handleChange}
        />
        <input
          className="row__half-width"
          type="text"
          id={DETAILS_KEYS.ED_LINK}
          value={details[DETAILS_KEYS.ED_LINK]}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor={DETAILS_KEYS.WHAT_GAME}>
          Game
        </label>
        <input
          type="radio"
          name={DETAILS_KEYS.WHAT_GAME}
          value={GAME_OPTIONS.GAME2}
          id={GAME_OPTIONS.GAME2}
          checked={details[DETAILS_KEYS.WHAT_GAME] === GAME_OPTIONS.GAME2}
          onChange={handleGameChange}
        />
        <label htmlFor={GAME_OPTIONS.GAME2}>ES!!</label>
        <input
          type="radio"
          name={DETAILS_KEYS.WHAT_GAME}
          value={GAME_OPTIONS.GAME1}
          id={GAME_OPTIONS.GAME1}
          checked={details[DETAILS_KEYS.WHAT_GAME] === GAME_OPTIONS.GAME1}
          onChange={handleGameChange}
        />
        <label htmlFor={GAME_OPTIONS.GAME1}>ES!</label>
      </div>
    </>
  );
}
