import React from 'react';
import { TLNotesEditor } from './CKEditor';

export default function TLNotesContent() {
  return (
    <>
      <div className="row row--label-only">
        <span className="row__spacer" />
        <label htmlFor="title">
          Arbitrary title needed to make citation links work
        </label>
      </div>
      <div className="row">
        <label className="row__spacer" htmlFor="title">
          Chapter Title
        </label>
        <input type="text" id="title" />
      </div>
      <div className="row row--tl-editor">
        <label htmlFor="TL Notes" className="row__spacer">
          TL Notes
        </label>
        <TLNotesEditor />
      </div>
    </>
  );
}
