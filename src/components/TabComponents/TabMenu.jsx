import React from 'react';

export default function TabMenu({ tabs, clicked, onClick }) {
  return (
    <div className="tab">
      {tabs.map((btn) => (
        <button
          type="button"
          key={btn}
          className={`tablink${clicked === btn ? ' active' : ''}`}
          onClick={() => onClick(btn)}
        >
          {btn}
        </button>
      ))}
    </div>
  );
}
