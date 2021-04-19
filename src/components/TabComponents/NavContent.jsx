import React, { useContext } from 'react';
import { NAV_KEYS } from 'Constants';
import { formatTopNavBar, formatBottomNavBar } from 'Utils/convertText';
import { StateContext } from '../Main/StateContext';

function NavContent() {
  const { nav, setNav } = useContext(StateContext);

  const handleChange = (e) => {
    const {
      target: { id, value },
    } = e;
    setNav({ ...nav, [id]: value });
  };

  return (
    <>
      <p>
        For examples on how to fill out the values in this tab, please refer to
        the{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://ensemble-stars.fandom.com/wiki/Template:StoryNavBar"
        >
          StoryNavBar template page
        </a>{' '}
        on the wiki.
      </p>
      <div className="row">
        <label className="row__spacer" htmlFor={NAV_KEYS.NAME}>
          Story Name
        </label>
        <input
          type="text"
          id={NAV_KEYS.NAME}
          value={nav[NAV_KEYS.NAME]}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor={NAV_KEYS.PREV}>
          Prev
        </label>
        <input
          type="text"
          id={NAV_KEYS.PREV}
          value={nav[NAV_KEYS.PREV]}
          onChange={handleChange}
        />
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor={NAV_KEYS.NEXT}>
          Next
        </label>
        <input
          type="text"
          id={NAV_KEYS.NEXT}
          value={nav[NAV_KEYS.NEXT]}
          onChange={handleChange}
        />
      </div>
      <p className="p--margin-bottom-none">Top nav bar code preview</p>
      <blockquote className="preview">{`${formatTopNavBar(nav)}`}</blockquote>
      <p className="p--margin-bottom-none">Bottom nav bar code preview</p>
      <blockquote className="preview">{`${formatBottomNavBar(
        nav
      )}`}</blockquote>
    </>
  );
}

export default NavContent;
