var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabMenu = function (_React$Component) {
  _inherits(TabMenu, _React$Component);

  function TabMenu(props) {
    _classCallCheck(this, TabMenu);

    var _this = _possibleConstructorReturn(this, (TabMenu.__proto__ || Object.getPrototypeOf(TabMenu)).call(this, props));

    _this.openTab = _this.openTab.bind(_this);
    _this.state = {
      buttonInfo: {
        'Text': 'inputArea',
        'Details': 'detailArea',
        'Renders': 'renderArea',
        'TL Notes': 'tlArea'
      },
      defaultOpen: 'Text',
      clicked: ''
    };
    return _this;
  }

  _createClass(TabMenu, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.querySelector('[value=\'' + this.state.defaultOpen + '\']').click();
    }
  }, {
    key: 'openTab',
    value: function openTab(btn, tabName) {
      var tabcontent = document.querySelectorAll('.tabcontent');
      for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
      }
      var active = document.querySelectorAll('.tablink');
      for (var _i = 0; _i < active.length; _i++) {
        active[_i].classList.remove = 'active';
      }
      var tabId = "#" + tabName;
      document.querySelector(tabId).style.display = 'block';
      this.setState({ clicked: btn });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var buttons = Object.keys(this.state.buttonInfo);
      var tabs = buttons.map(function (btn) {
        return React.createElement(TabLink, { key: btn,
          value: btn,
          className: 'tablink' + (_this2.state.clicked === btn ? ' active' : ''),
          text: btn,
          onClick: function onClick() {
            return _this2.openTab(btn, _this2.state.buttonInfo[btn]);
          }
        });
      });
      return tabs;
    }
  }]);

  return TabMenu;
}(React.Component);

function TabLink(props) {
  return React.createElement(
    'button',
    { className: props.className, value: props.value, onClick: props.onClick },
    props.text
  );
}

var RenderForms = function (_React$Component2) {
  _inherits(RenderForms, _React$Component2);

  function RenderForms(props) {
    _classCallCheck(this, RenderForms);

    var _this3 = _possibleConstructorReturn(this, (RenderForms.__proto__ || Object.getPrototypeOf(RenderForms)).call(this, props));

    _this3.updateNames = _this3.updateNames.bind(_this3);
    _this3.state = {
      namesSet: new Set()
    };
    return _this3;
  }

  //function that handles editor from data


  _createClass(RenderForms, [{
    key: 'updateNames',
    value: function updateNames(editor) {
      var currentNames = this.state.namesSet;
      var inputDom = extractBr(convertToDom(editor.getData()));
      var input = getTextFromDom(inputDom);
      var names = new Set(); //add "key" of each line if there is one
      input.forEach(function (line) {
        var name = line.split(' ')[0]; //get first word in the line
        if (name.includes(':')) {
          //if there is a colon
          name = name.slice(0, name.indexOf(':')); //get text up until colon
          name = name.replace(/<\/*\w+>/g, ''); //remove html tags
          if (namesLink[name.toUpperCase()] != undefined) {
            //if valid name
            name = name[0].toUpperCase() + name.slice(1, name.length); //format name ex. arashi --> Arashi
            names.add(name);
          }
        }
      });
      currentNames.forEach(function (name) {
        if (!names.has(name)) {
          currentNames.delete(name);
        }
      });
      names.forEach(function (name) {
        if (!currentNames.has(name)) {
          //keep the previously existing rows so that renders don't have to be re-entered
          currentNames.add(name);
        }
      });
      this.setState({ namesSet: currentNames });
    }
  }, {
    key: 'render',
    value: function render() {
      //console.log(this.state.namesSet);
      var rows = Array.from(this.state.namesSet).map(function (name) {
        return React.createElement(RenderRow, { key: name, name: name, link: namesLink[name] });
      });
      return rows;
    }
  }]);

  return RenderForms;
}(React.Component);

function RenderRow(props) {
  return React.createElement(
    'div',
    { className: 'row' },
    React.createElement(
      'label',
      { className: 'spacer' },
      React.createElement(RenderLink, { link: props.link, name: props.name })
    ),
    React.createElement('input', { id: props.name })
  );
}

function RenderLink(props) {
  return React.createElement(
    'a',
    { href: 'http://ensemble-stars.wikia.com/wiki/' + props.link + '/Gallery#Render', target: '_blank' },
    props.name
  );
}

function ColorInputs(props) {
  var labels = props.labels;
  return labels.map(function (label) {
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        { className: 'spacer' },
        label[0].toUpperCase() + label.slice(1, label.length)
      ),
      React.createElement('input', { className: 'jscolor {width:101, padding:0, shadow:false, borderWidth:0, backgroundColor:\'transparent\', position:\'right\'}',
        spellcheck: 'false',
        name: label + 'Col' })
    );
  });
}

function setup() {
  ReactDOM.render(React.createElement(TabMenu, null), document.querySelector('.tab'));
  ReactDOM.render(React.createElement(ColorInputs, { labels: ['writer', 'location', 'bottom', 'text'] }), document.querySelector('#colorinputs'));
  ReactDOM.render(React.createElement(RenderForms, { ref: function ref(element) {
      window.renderForms = element;
    } }), document.querySelector('#renderForms'));
  BalloonEditor.create(document.querySelector('#inputEditor'), {
    toolbar: {
      items: ['bold', 'italic', 'link', '|', 'undo', 'redo']
    },
    //callback funtion when editor content changes
    autosave: {
      save: function save(editor) {
        window.renderForms.updateNames(editor);
      }
    }
  }).then(function (editor) {
    window.editor1 = editor;
  }).catch(function (error) {
    console.error(error);
  });

  BalloonEditor.create(document.querySelector('#tlEditor'), {
    toolbar: {
      items: ['bold', 'italic', 'link', 'numberedList', '|', 'undo', 'redo']
    }
  }).then(function (editor) {
    window.editor2 = editor;
  }).catch(function (error) {
    console.error(error);
  });
  var editors = document.querySelectorAll('.editor');
  for (var i = 0; i < editors.length; i++) {
    editors[i].setAttribute('spellcheck', 'false');
  }
}