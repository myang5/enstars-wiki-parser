!function(e){function t(t){for(var r,a,u=t[0],s=t[1],c=t[2],f=0,p=[];f<u.length;f++)a=u[f],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);for(l&&l(t);p.length;)p.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,u=1;u<n.length;u++){var s=n[u];0!==o[s]&&(r=!1)}r&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},o={1:0},i=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var u=window.webpackJsonp=window.webpackJsonp||[],s=u.push.bind(u);u.push=t,u=u.slice();for(var c=0;c<u.length;c++)t(u[c]);var l=s;i.push([92,0]),n()}({71:function(e,t,n){"use strict";var r=n(0),o=Object(r.createContext)();t.a=o},92:function(e,t,n){"use strict";n.r(t),n.d(t,"InputEditor",(function(){return y})),n.d(t,"TLNotesEditor",(function(){return v}));var r=n(0),o=n.n(r),i=n(109),a=n.n(i),u=n(115),s=n(117),c=n(121),l=n(119),f=n(120),p=n(116),d=n(154),h=n(118),g=n(155),b=n(71);function y(e){var t=Object(r.useContext)(b.a).inputRef,n={plugins:[l.a,f.a,p.a,h.a,s.a,c.a,g.a],toolbar:["bold","italic","link","|","undo","redo"],autosave:{save:function(t){return e.updateNames(t)}}};return Object(r.useEffect)((function(){t.current.editor.editing.view.change((function(e){e.setAttribute("spellcheck","false",t.current.editor.editing.view.document.getRoot())}))}),[]),o.a.createElement(a.a,{editor:u.a,config:n,data:"<p>If this is your first time using the formatter, please check the <a href='/#/howto'>Text Guidelines</a> to make\n        sure your text is ready.</p>\n      <p>---EXAMPLE DIALOGUE---</p>\n      <p>The header image.png</p>\n      <p><strong>Person A:</strong> This is a line said by Person A! Their line starts with their name followed by a colon.</p>\n      <p><strong>Person B:</strong> This is a line said by another person!</p>\n      <p>Heading: Location: Hallway (will format to \"Location: Hallway\")</p>\n      <p>A screenshot of the game.jpeg</p>\n      <p><strong>Person A:</strong> Another line from Person A.</p>",ref:t})}function v(){var e=Object(r.useContext)(b.a).tlNotesRef,t={plugins:[l.a,f.a,p.a,d.a,h.a,s.a,c.a],toolbar:["bold","italic","link","numberedList","|","undo","redo"]};return Object(r.useEffect)((function(){e.current.editor.editing.view.change((function(t){t.setAttribute("spellcheck","false",e.current.editor.editing.view.document.getRoot())}))}),[]),o.a.createElement(a.a,{editor:u.a,config:t,data:"<p>If this is your first time using the formatter, please check the <a href='./howto.html#tlNotesSection'>Text\n     Guidelines</a> for how to add translation notes.</p>",ref:e})}}});