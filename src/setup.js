

class RenderForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      namesValue: {},
      currentNames: new Set(),

    }
    this.updateNames = this.updateNames.bind(this);
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
  updateNames(editor) {
    let inputDom = extractBr(convertToDom(editor.getData()))
    let input = getTextFromDom(inputDom);
    const names = new Set(); //add "key" of each line if there is one
    input.forEach(function (line) {
      let name = line.split(' ')[0]; //get first word in the line
      if (name.includes(':')) { //if there is a colon
        name = name.slice(0, name.indexOf(':')); //get text up until colon
        if (namesLink[name.toUpperCase()] != undefined) { //if valid name
          name = name[0].toUpperCase() + name.slice(1, name.length); //format name ex. arashi --> Arashi
          names.add(name);
        }
      }
    });
    this.setState({ currentNames: names });
  }

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

//function ColorInputs(props) {
//  const labels = props.labels;
//  return (
//    labels.map(label =>
//      <div className='row'>
//        <label className='spacer'>{label[0].toUpperCase() + label.slice(1, label.length)}</label>
//        <input className="jscolor {width:101, padding:0, shadow:false, borderWidth:0, backgroundColor:'transparent', position:'right'}"
//          spellcheck='false'
//          name={label + 'Col'} />
//      </div>
//    )
//  )
//}

function setup() {
  //ReactDOM.render(<ColorInputs labels={['writer', 'location', 'bottom', 'text']}/>, document.querySelector('#colorinputs'))
  ReactDOM.render(<RenderForms ref={(element) => { window.renderForms = element }} />, document.querySelector('#renderForms'));
  
  //document.querySelector('#translator').value = localStorage.getItem('translator');
  //document.querySelector('#tlLink').value = localStorage.getItem('tlLink');
  //document.querySelector('#editor').value = localStorage.getItem('editor');
  //document.querySelector('#edLink').value = localStorage.getItem('edLink');

  BalloonEditor
    .create(document.querySelector('#inputEditor'), {
      toolbar: {
        items: [
          'bold',
          'italic',
          'link',
          '|',
          'undo',
          'redo'
        ]
      },
      //callback funtion when editor content changes
      autosave: {
        save(editor) {
          window.renderForms.updateNames(editor);
        }
      }
    })
    .then(editor => {
      window.editor1 = editor;
    })
    .catch(error => {
      console.error(error);
    });

  BalloonEditor
    .create(document.querySelector('#tlEditor'), {
      toolbar: {
        items: [
          'bold',
          'italic',
          'link',
          'numberedList',
          '|',
          'undo',
          'redo'
        ]
      }
    })
    .then(editor => {
      window.editor2 = editor;
    })
    .catch(error => {
      console.error(error);
    });
  const editors = document.querySelectorAll('.editor');
  for (let i = 0; i < editors.length; i++) {
    editors[i].setAttribute('spellcheck', 'false')
  }
}