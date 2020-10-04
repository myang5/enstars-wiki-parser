import React from 'react';
import { TLNotesEditor } from './CKEditor';

export default function TLNotesContent() {
  return (
    <>
      <div className="row label">
        <span className="spacer" />
        <label htmlFor="title">Arbitrary title needed to make citation links work</label>
      </div>
      <div className="row">
        <label className="spacer" htmlFor="title">
          Chapter Title
        </label>
        <input type="text" id="title" />
      </div>
      <div className="row tlEditor">
        <label htmlFor="TL Notes" className="spacer">TL Notes</label>
        <TLNotesEditor />
      </div>
    </>
  );
}
