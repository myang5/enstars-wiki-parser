import React from 'react';

export default function Issues() {
  return (
    <div className="pageContent">
      <p>
        To register an issue, please contact Midori through <a target="_blank" href="https://twitter.com/gayandasleep">Twitter</a> or on Discord.
      </p>
      <h3>KNOWN ISSUES</h3>
        <ul>
          <li>
            Does not work for Remy
          </li>
          <li>
            Colors chosen in Details tab are not reflected in the output
          </li>
          <li>
            Formatter seems to arbitrarily break when styling is applied to the character name
          </li>
        </ul>
      <h3>RESOLVED</h3>
        <ul>
          <li>
            '#' characters are not appended to hexadecimal colors in output
          </li>
        </ul>
    </div>
  );
};