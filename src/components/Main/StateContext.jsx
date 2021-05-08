import React, { createContext, useState, useRef } from 'react';
import {
  AUTHOR_NAMES,
  COLORS_KEYS,
  DETAILS_KEYS,
  GAME_OPTIONS,
} from 'Constants';
import getEmptyPersonObject from 'Utils/getEmptyPersonObject';

export const StateContext = createContext();

const getPersonsValue = (key) =>
  JSON.parse(localStorage.getItem(key)) || [getEmptyPersonObject()];

export const StateProvider = ({ children }) => {
  const [renders, setRenders] = useState({});
  // needed to solve stale closure problem when renders is passed to CKEditor autosave
  // that was causing existing input values to be erased
  // https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
  const renderRef = useRef(renders);
  const [details, setDetails] = useState({
    [DETAILS_KEYS.LOCATION]: '',
    [DETAILS_KEYS.AUTHOR]: AUTHOR_NAMES.AKIRA,
    [DETAILS_KEYS.TRANSLATORS]: getPersonsValue(DETAILS_KEYS.TRANSLATORS),
    [DETAILS_KEYS.EDITORS]: getPersonsValue(DETAILS_KEYS.EDITORS),
    [DETAILS_KEYS.WHAT_GAME]: GAME_OPTIONS.GAME2,
  });
  const [colors, setColors] = useState({
    [COLORS_KEYS.WRITER]: '#FFFFFF',
    [COLORS_KEYS.LOCATION]: '#FFFFFF',
    [COLORS_KEYS.BOTTOM]: '#FFFFFF',
    [COLORS_KEYS.TEXT]: '#FFFFFF',
  });
  const [nav, setNav] = useState(JSON.parse(localStorage.getItem('nav')) || {});

  // create refs for each CKEditor to pass into EditorContext
  const inputRef = useRef(null);
  const tlNotesRef = useRef(null);

  const state = {
    renders,
    renderRef,
    setRenders,
    details,
    setDetails,
    colors,
    setColors,
    nav,
    setNav,
    inputRef,
    tlNotesRef,
  };

  return (
    <StateContext.Provider value={state}>{children}</StateContext.Provider>
  );
};
