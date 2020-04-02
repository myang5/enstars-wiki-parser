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

ReactDOM.render(React.createElement(TabMenu, null), document.querySelector('.tab'));