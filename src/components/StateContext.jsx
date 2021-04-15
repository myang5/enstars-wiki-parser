import React, { createContext, useState, useRef } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [renders, setRenders] = useState({});
  // needed to solve stale closure problem when renders is passed to CKEditor autosave
  // that was causing existing input values to be erased
  // https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
  const renderRef = useRef(renders);
  const [details, setDetails] = useState({
    location: '',
    author: '日日日 (Akira)',
    translator: localStorage.getItem('translator') || '',
    tlLink: localStorage.getItem('tlLink') || '',
    editor: localStorage.getItem('editor') || '',
    edLink: localStorage.getItem('edLink') || '',
    whatGame: 'Story !!',
  });
  const [colors, setColors] = useState({
    writer: '#FFFFFF',
    location: '#FFFFFF',
    bottom: '#FFFFFF',
    text: '#FFFFFF',
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

  return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
};
