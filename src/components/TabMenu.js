import React from 'react';

export default function TabMenu(props) {
  const openTab = (e) => {
    const btn = e.target.value;
    props.setClicked(btn);
  }

  return (
    <div className="tab">
      {Object.keys(props.buttonInfo).map((btn) =>
        <TabLink key={btn}
          value={btn}
          className={'tablink' + (props.clicked === btn ? ' active' : '')}
          text={btn}
          onClick={openTab}
        />
      )}
    </div>
  );
}

function TabLink(props) {
  return (
    <button className={props.className} value={props.value} onClick={props.onClick}>
      {props.text}
    </button>
  )
}