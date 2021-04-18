import React, { createContext, useState, useRef } from 'react';
import {
  AUTHOR_NAMES,
  COLORS_KEYS,
  DETAILS_KEYS,
  GAME_OPTIONS,
} from '../constants';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [renders, setRenders] = useState({});
  // needed to solve stale closure problem when renders is passed to CKEditor autosave
  // that was causing existing input values to be erased
  // https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
  const renderRef = useRef(renders);
  const [details, setDetails] = useState({
    [DETAILS_KEYS.LOCATION]: '',
    [DETAILS_KEYS.AUTHOR]: AUTHOR_NAMES.AKIRA,
    [DETAILS_KEYS.TRANSLATOR]:
      localStorage.getItem(DETAILS_KEYS.TRANSLATOR) || '',
    [DETAILS_KEYS.TL_LINK]: localStorage.getItem(DETAILS_KEYS.TL_LINK) || '',
    [DETAILS_KEYS.EDITOR]: localStorage.getItem(DETAILS_KEYS.EDITOR) || '',
    [DETAILS_KEYS.ED_LINK]: localStorage.getItem(DETAILS_KEYS.ED_LINK) || '',
    [DETAILS_KEYS.WHAT_GAME]: GAME_OPTIONS.GAME2,
  });
  const [colors, setColors] = useState({
    [COLORS_KEYS.WRITER]: '#FFFFFF',
    [COLORS_KEYS.LOCATION]: '#FFFFFF',
    [COLORS_KEYS.BOTTOM]: '#FFFFFF',
    [COLORS_KEYS.TEXT]: '#FFFFFF',
  });

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
    inputRef,
    tlNotesRef,
  };

  return (
    <StateContext.Provider value={state}>{children}</StateContext.Provider>
  );
};
