import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const lastUpdated = '9/20/20';
  const desc = (
    <>
      A website to more easily upload event/gacha stories from the mobile idol game Ensemble Stars
      to the fandom wiki.
      <br />
      It formats your story chapter into text that can be pasted directly into the
      &quot;source&quot; section of the page.
      <br />
      {'Developed by '}
      <a target="_blank" rel="noreferrer" href="https://twitter.com/gayandasleep">
        midori
      </a>
      {` (last updated ${lastUpdated}).`}
    </>
  );

  return (
    <header>
      <h1>
        <Link to="/">ENSTARS STORY FORMATTER</Link>
      </h1>
      <div className="horizontal">
        <p>{desc}</p>
        <ul id="navbar">
          <li>
            <Link to="/howto">HOW TO USE</Link>
          </li>
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/myang5/enstars-wiki-parser/issues"
            >
              KNOWN ISSUES
            </a>
          </li>
          <li>
            <a target="_blank" rel="noreferrer" href="https://twitter.com/gayandasleep">
              CONTACT
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/myang5/enstars-wiki-parser"
            >
              GITHUB
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
