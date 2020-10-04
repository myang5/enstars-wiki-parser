import React from 'react';

export default function TabContent({ clicked, value, children }) {
  return (
    // set className so that CSS controls which TabContent is visible
    <div className={`tabContent${clicked === value ? ' active' : ''}`} id={value.replace(/ /g, '')}>
      {children}
    </div>
  );
}
