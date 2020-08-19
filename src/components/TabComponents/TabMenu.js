import React from 'react';

export default function TabMenu({ tabs, clicked, setClicked }) {
  const openTab = (e) => {
    const btn = e.target.value;
    setClicked(btn);
  }

  return (
    <div className="tab">
      {tabs.map((btn) =>
        <button key={btn} className={'tablink' + (clicked === btn ? ' active' : '')} value={btn} onClick={openTab}>
          {btn}
        </button>
      )}
    </div>
  );
}