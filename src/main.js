const namesLink = {
  TETORA: 'Tetora_Nagumo',
  HAJIME: 'Hajime_Shino',
  TOMOYA: 'Tomoya_Mashiro',
  HINATA: 'Hinata_Aoi',
  MIDORI: 'Midori_Takamine',
  TORI: 'Tori_Himemiya',
  SHINOBU: 'Shinobu_Sengoku',
  MITSURU: 'Mitsuru_Tenma',
  YUTA: 'Yuta_Aoi',
  TSUKASA: 'Tsukasa_Suou',
  SORA: 'Sora_Harukawa',
  SUBARU: 'Subaru_Akehoshi',
  HOKUTO: 'Hokuto_Hidaka',
  MAKOTO: 'Makoto_Yuuki',
  SOUMA: 'Souma_Kanzaki',
  ADONIS: 'Adonis_Otogari',
  NATSUME: 'Natsume_Sakasaki',
  KOGA: 'Koga_Oogami',
  RITSU: 'Ritsu_Sakuma',
  MAO: 'Mao_Isara',
  YUZURU: 'Yuzuru_Fushimi',
  ARASHI: 'Arashi_Narukami',
  MIKA: 'Mika_Kagehira',
  EICHI: 'Eichi_Tenshouin',
  KEITO: 'Keito_Hasumi',
  KAORU: 'Kaoru_Hakaze',
  IZUMI: 'Izumi_Sena',
  CHIAKI: 'Chiaki_Morisawa',
  SHU: 'Shu_Itsuki',
  MADARA: 'Madara_Mikejima',
  KURO: 'Kuro_Kiryu',
  WATARU: 'Wataru_Hibiki',
  KANATA: 'Kanata_Shinkai',
  REI: 'Rei_Sakuma',
  NAZUNA: 'Nazuna_Nito',
  LEO: 'Leo_Tsukinaga',
  TSUMUGI: 'Tsumugi_Aoba',
  JIN: 'Jin_Sagami',
  AKIOMI: 'Akiomi_Kunugi',
  HIYORI: 'Hiyori_Tomoe',
  JUN: 'Jun_Sazanami',
  NAGISA: 'Nagisa_Ran',
  IBARA: 'Ibara_Saegusa',
  RINNE: 'Rinne_Amagi',
  HIMERU: 'HiMERU',
  KOHAKU: 'Kohaku_Oukawa',
  NIKI: 'Niki_Shiina',
  HIIRO: 'Hiiro_Amagi',
  AIRA: 'Aira_Shiratori',
  MAYOI: 'Mayoi_Ayase',
  TATSUMI: 'Tatsumi_Kazehaya'
};

class RenderForms extends React.Component {
  constructor(props) {
    super(props);
    this.updateNames = this.updateNames.bind(this);
    this.state = {
      namesSet: new Set(),
    }
  }

  //function that handles editor from data
  updateNames(editor) {
    const currentNames = this.state.namesSet;
    let input = getTextFromDom(convertToDom(editor.getData()));
    const names = new Set(); //add "key" of each line if there is one
    input.forEach(function (line) {
      let name = line.split(' ')[0]; //get first word in the line
      if (name.includes(':')) { //if there is a colon
        name = name.slice(0, name.indexOf(':')); //get text up until colon
        name = name.replace(/<\/*\w+>/g, ''); //remove html tags
        if (namesLink[name.toUpperCase()] != undefined) { //if valid name
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
      if (!currentNames.has(name)) { //keep the previously existing rows so that renders don't have to be re-entered
        currentNames.add(name);
      }
    });
    this.setState({ namesSet: currentNames });
  }

  render() {
    //console.log(this.state.namesSet);
    const rows = Array.from(this.state.namesSet).map(name =>
      <RenderRow key={name} name={name} link={namesLink[name]} />
    );
    return rows
  }
}

function RenderRow(props) {
  return (
    <div className='row'>
      <label className='spacer'>
        <RenderLink link={props.link} name={props.name} />
      </label>
      <input id={props.name} />
    </div>
  )
}

function RenderLink(props) {
  return (
    <a href={`http://ensemble-stars.wikia.com/wiki/${props.link}/Gallery#Render`} target='_blank'>
      {props.name}
    </a>)
}

function setup() {
  ReactDOM.render(<RenderForms ref={(element) => {window.renderForms = element}}/>, document.querySelector('#renderForms'));
  //$('.active').click();
  BalloonEditor
    .create(document.querySelector('#inputEditor'), {
      toolbar: {
        items: [
          'bold',
          'italic',
          'link',
          '|',
          'fontBackgroundColor',
          'fontColor',
          '|',
          'undo',
          'redo'
        ]
      },
      //callback funtion when editor content changes
      autosave: {
        save(editor) {
          //idk what goes here?
          //do I just render a new component like this:
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

//copies text to clipboard
function copyToClip() {
  $('#output').select();
  document.execCommand("copy");
  $('#copyBtn').text('Copied');
}

//lmao
function convertToDom(data) {
  return new DOMParser().parseFromString(data, 'text/html');
}

//each line in CKEditor has <p> wrapper
//params: editorDom - editor data already converted to DOM object
//returns an Array of each line of text
function getTextFromDom(editorDom) {
  const paragraphs = editorDom.querySelectorAll('p');
  const input = []
  paragraphs.forEach(function (p) {
    input.push(p.innerHTML.replace(/&nbsp;/g, ''));
  });
  return input;
}

function convertText() {

  $('#copyBtn').text('Copy Output');

  const values = getValues(); //get user input from all the tabs

  //format wiki code with user input
  const header =
    `{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"
! colspan="2" style="text-align:center;background-color:${values.writerCol}; color:${values.textCol};" |'''Writer:''' ${values.author}
|-
| colspan="2" |[[File:HEADERFILE|660px|link=|center]]
|-
! colspan="2" style="text-align:center;background-color:${values.locationCol}; color:${values.textCol};" |'''Location: ${values.location}'''
`;
  const dialogueRender =
    `|-
|[[File:FILENAME|x200px|link=|center]]
|
`;
  const cgRender =
    `|-
! colspan="2" style="text-align:center;" |[[File:FILENAME|center|660px]]
`;
  const heading =
    `|-
! colspan="2" style="text-align:center;background-color:${values.locationCol}; color:${values.textCol};" |'''HEADING'''
`
  const footer =
    `|-
! colspan="2" style="text-align:center;background-color:${values.bottomCol};color:${values.textCol};" |'''Translation: [${values.translator}] '''
|}`;

  let inputDom = formatStyling(convertToDom(editor1.getData()));
  //inputDom = clearGDocSpan(inputDom);
  let input = getTextFromDom(inputDom);
  let output = header;
  //console.log(input);

  let currentName = ''; //needed for case where dialogue has name on every line
  input.forEach(function (line) {
    if (line != '') { //ignore empty lines
      if (isFileName(line)) {
        console.log('isFileName: true...');
        //alert user if there is no header
        if (input.indexOf(line) === 0) { //if image file for the header 
          console.log('headerfile');
          output = output.replace("HEADERFILE", line.trim());
        }
        else { //if CG or scene change image file
          console.log('image file');
          let cgCode = cgRender;
          output += cgCode.replace("FILENAME", line.trim());
          currentName = ''; //since its new section
        }
      }
      else { //if dialogue line or header
        line = formatTlMarker(line);
        let firstWord = line.split(" ")[0];
        if (!firstWord.includes(":")) { //if no colon --> continuing dialogue line
          console.log('no colon, continue dialogue');
          output += line + "\n\n";
        }
        else {
          console.log('has colon...')
          firstWord = firstWord.slice(0, -1); //remove colon
          if (firstWord.toUpperCase() === 'HEADING') { //if heading
            console.log('new HEADING');
            let headingCode = heading;
            output += headingCode.replace("HEADING", line.slice(line.indexOf(':') + 1).trim());
            currentName = ''; //since its new section
          }
          else if (namesLink[firstWord.toUpperCase()] != undefined) { //if valid character is speaking
            console.log('character speaking... ' + firstWord);
            if (firstWord !== currentName) { //if new character is speaking
              console.log('new character detected')
              //add dialogueRender code to output
              let renderCode = dialogueRender;
              let id = "#" + firstWord[0].toUpperCase() + firstWord.slice(1, firstWord.length); //create id to access chara's render file in Renders tab
              output += renderCode.replace("FILENAME", $(id).val().trim());
              //update currentName
              currentName = firstWord;
            }
            line = line.slice(line.indexOf(":") + 1).trim(); //get chara's spoken line
            output += line + "\n\n";
          }
          else {
            console.log('Formatter was unable to process this name: ' + firstWord);
          }
        }
      }
    }

  });

  output += formatTlNotes(editor2.getData());
  output += footer;
  $('#output').val(output);
}

//helper function for convertText
function getValues() {
  const values = {}
  values.location = $('#location').val().trim();
  values.author = $('#author option:selected').text();
  values.translator = $('#translator').val().trim();
  values.tlLink = $('#tlLink').val().trim();
  if (values.tlLink === '') { //if TL credit is to a wiki user
    values.translator = `[User:${values.translator}|${values.translator}]`;
  }
  else { //if TL credit is to an external wiki user
    values.translator = `${values.tlLink} ${values.translator}`;
  }
  values.writerCol = $('input[name=writerCol]').val();
  values.locationCol = $("input[name=locationCol]").val();
  values.bottomCol = $('input[name=bottomCol]').val();
  values.textCol = $('input[name=textCol]').val();
  return values;
}

//helper function to check if the line is a file
//params: line - a String
//returns a boolean value representing if the string is a file name
function isFileName(line) {
  const extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  for (let i = 0; i < extensions.length; i++) {
    if (line.toLowerCase().endsWith(extensions[i])) {
      return true;
    }
  }
  return false;
}

//helper function to format bold, italics, links based on HTML tags
//params: editorDom - editor data already converted to DOM object
//returns a DOM object with specified HTML tags converted to wiki code equivalent
function formatStyling(editorDom) {
  editorDom.querySelectorAll('strong').forEach(function (strong) {
    strong.replaceWith(`'''${strong.innerText}'''`);
  });
  editorDom.querySelectorAll('i').forEach(function (italic) {
    italic.replaceWith(`''${italic.innerText}''`);
  });
  editorDom.querySelectorAll('a').forEach(function (link) {
    link.replaceWith(`[${link.href} ${link.innerText}]`);
  });
  return editorDom;
}

//helper function to format tl note markers
function formatTlMarker(line) {
  if (line.search(/\[\d+\]/) != -1) { //if there is a tlMarker
    let title = getChapTitle(editor2.getData());
    if (title != undefined) {
      let tlCode = `<span id='${title}RefNUM'>[[#${title}NoteNUM|<sup>[NUM]</sup>]]</span>`;
      const markers = line.match(/\[\d+\]/g);
      markers.forEach(function (marker) {
        let num = marker.substring(marker.indexOf('[') + 1, marker.indexOf(']'));
        let newTlCode = tlCode.replace(/NUM/g, num);
        line = line.replace(marker, newTlCode)
      });
    }
  }
  return line;
}

//helper function to get and format chapter title from tl notes
//assumes the editor has some data
function getChapTitle(data) {
  if (data.includes('<ol>') && data.includes('<p>')) { //editor already has the <p> in it, so user must input some sort of new <p> (the chapter title) and an <ol> (the TL notes)
    //let inputDom = clearGDocSpan(convertToDom(data).querySelector('p'));
    let inputDom = (convertToDom(data).querySelector('p'));
    let title = inputDom.innerText;
    title = title.replace(' ', '');
    return title;
  }
  else {
    //ERROR: add alert to let user know they didn't provide a chapter title
    console.log('Please make sure to include a title in the TL Notes section')
  }
}

//helper function to format TlNotes
//assumes that there is a valid title and correct number of TL notes
function formatTlNotes() {
  let title = getChapTitle(editor2.getData()); //ERROR: only do this if there are tl notes available
  if (title != undefined) {
    let inputDom = formatStyling(convertToDom(editor2.getData()));
    let notes = []
    const listItems = inputDom.querySelectorAll('li');
    listItems.forEach(function (li) {
      notes.push(li.innerHTML.replace(/&nbsp;/g, ''));
    });
    let output =
      `|-
| colspan="2"|`;
    let tlCode = `<span id='${title}NoteNUM'>NUM.[[#${title}RefNUM|↑]] TEXT</span><br />`;
    for (let i = 0; i < notes.length; i++) {
      let newTlCode = tlCode.replace(/NUM/g, i + 1);
      output += newTlCode.replace('TEXT', notes[i]);
    }
    output = output.replace(/<br \/>$/m, "\n");
    return output;
  }
  else return ''
}

