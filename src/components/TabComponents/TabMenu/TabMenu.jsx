import React from 'react';
import './TabMenu.less';

export default function TabMenu({ tabs, clicked, onClick }) {
  return (
    <div className="tab-menu">
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
