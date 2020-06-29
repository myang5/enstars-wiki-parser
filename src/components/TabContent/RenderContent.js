import React from 'react';

export default class RenderForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      namesValue: {},
      currentNames: new Set(),
    }
    //this.updateNames = this.updateNames.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.persist();
    this.setState(state => {
      const newValue = {...state.namesValue};
      newValue[event.target.id] = event.target.value;
      return {namesValue: newValue};
    });
  }

  //function that handles editor from data
  //TODO: figure out where to put this function since it should be attached to autosave of InputEditor
  //TODO: import helper functions from convertText
  //updateNames(editor) {
  //  let inputDom = extractBr(convertToDom(editor.getData()))
  //  let input = getTextFromDom(inputDom);
  //  const names = new Set(); //add "key" of each line if there is one
  //  input.forEach(function (line) {
  //    let name = line.split(' ')[0]; //get first word in the line
  //    if (name.includes(':')) { //if there is a colon
  //      name = name.slice(0, name.indexOf(':')); //get text up until colon
  //      if (namesLink[name.toUpperCase()] != undefined) { //if valid name
  //        name = name[0].toUpperCase() + name.slice(1, name.length); //format name ex. arashi --> Arashi
  //        names.add(name);
  //      }
  //    }
  //  });
  //  this.setState({ currentNames: names });
  //}

  render() {
    const rows = Array.from(this.state.currentNames).map(name =>
      <RenderRow key={name} 
      name={name} 
      value={this.state.namesValue[name]}
      link={namesLink[name.toUpperCase()]} 
      handleChange={this.handleChange} />
    );
    return rows;
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
    </a>)
}