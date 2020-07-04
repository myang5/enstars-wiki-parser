import React from 'react';
import { NAME_LINKS } from '../../convertText/data';

export default function RenderContent(props) {
  return (
    <>
      <p>
        Please paste in the file names of the dialogue renders as written in the wiki (ex. Tsukasa Suou School Dialogue Render.png)
        <br />
        (This tab will fill out once you paste dialogue into the Text tab)
      </p>
      <RenderForms names={props.names} />
    </>
  );
}

class RenderForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      namesValue: {}
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // TODO: see if it's possible to convert to uncontrolled component
  handleChange(event) {
    event.persist();
    this.setState(state => {
      const newValue = { ...state.namesValue };
      newValue[event.target.id] = event.target.value;
      return { namesValue: newValue };
    });
  }

  render() {
    const rows = Array.from(this.props.names, name =>
      <RenderRow key={name}
        name={name}
        value={this.state.namesValue[name]}
        link={NAME_LINKS[name.toUpperCase()]}
        handleChange={this.handleChange} />
    );
    return (
      <div id='renderForms'>
        {rows}
      </div>
    )
  }
}

function RenderRow(props) {
  return (
    <div className='row'>
      <label className='spacer'>
        <RenderLink link={props.link} name={props.name} />
      </label>
      <input id={props.name} onChange={props.handleChange} defaultValue={props.value ? props.value : ''} />
    </div>
  )
}

function RenderLink(props) {
  return (
    <a href={`http://ensemble-stars.wikia.com/wiki/${props.link}/Gallery#Render`} target='_blank'>
      {props.name}
    </a>
  )
}