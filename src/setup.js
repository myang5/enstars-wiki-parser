class TabMenu extends React.Component {
  constructor(props) {
    super(props);
    this.openTab = this.openTab.bind(this);
    this.state = {
      buttonInfo: {
        'Text': 'inputArea',
        'Details': 'detailArea',
        'Renders': 'renderArea',
        'TL Notes': 'tlArea',
      },
      defaultOpen: 'Text',
      clicked: '',
    }
  }

  componentDidMount() {
    document.querySelector(`[value='${this.state.defaultOpen}']`).click();
  }

  openTab(btn, tabName) {
    const tabcontent = document.querySelectorAll('.tabcontent');
    for(let i=0; i<tabcontent.length; i++){
      tabcontent[i].style.display = 'none';
    }
    const active = document.querySelectorAll('.tablink');
    for(let i=0; i<active.length; i++){
      active[i].classList.remove = 'active';
    }
    let tabId = "#" + tabName;
    document.querySelector(tabId).style.display = 'block';
    this.setState({ clicked: btn })
  }

  render() {
    const buttons = Object.keys(this.state.buttonInfo);
    const tabs = buttons.map((btn) => 
      <TabLink key={btn}
        value={btn}
        className={'tablink' + (this.state.clicked === btn ? ' active' : '')}
        text={btn}
        onClick={() => this.openTab(btn, this.state.buttonInfo[btn])} 
        />
    )     
    return tabs;
  }
}

function TabLink(props) {
  return (
    <button className={props.className} value={props.value} onClick={props.onClick}>
      {props.text}
    </button>
  )
}

ReactDOM.render(
  <TabMenu />, document.querySelector('.tab')
);