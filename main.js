const namesLink = {
  TETORA:'Tetora_Nagumo',
  HAJIME:'Hajime_Shino',
  TOMOYA:'Tomoya_Mashiro',
  HINATA:'Hinata_Aoi',
  MIDORI:'Midori_Takamine',
  TORI:'Tori_Himemiya',
  SHINOBU:'Shinobu_Sengoku',
  MITSURU:'Mitsuru_Tenma',
  YUTA:'Yuta_Aoi',
  TSUKASA:'Tsukasa_Suou',
  SORA:'Sora_Harukawa',
  SUBARU:'Subaru_Akehoshi',
  HOKUTO:'Hokuto_Hidaka',
  MAKOTO:'Makoto_Yuuki',
  SOUMA:'Souma_Kanzaki',
  ADONIS:'Adonis_Otogari',
  NATSUME:'Natsume_Sakasaki',
  KOGA:'Koga_Oogami',
  RITSU:'Ritsu_Sakuma',
  MAO:'Mao_Isara',
  YUZURU:'Yuzuru_Fushimi',
  ARASHI:'Arashi_Narukami',
  MIKA:'Mika_Kagehira',
  EICHI:'Eichi_Tenshouin',
  KEITO:'Keito_Hasumi',
  KAORU:'Kaoru_Hakaze',
  IZUMI:'Izumi_Sena',
  CHIAKI:'Chiaki_Morisawa',
  SHU:'Shu_Itsuki',
  MADARA:'Madara_Mikejima',
  KURO:'Kuro_Kiryu',
  WATARU:'Wataru_Hibiki',
  KANATA:'Kanata_Shinkai',
  REI:'Rei_Sakuma',
  NAZUNA:'Nazuna_Nito',
  LEO:'Leo_Tsukinaga',
  TSUMUGI:'Tsumugi_Aoba',
  JIN:'Jin_Sagami',
  AKIOMI:'Akiomi_Kunugi',
  HIYORI:'Hiyori_Tomoe',
  JUN:'Jun_Sazanami',
  NAGISA:'Nagisa_Ran',
  IBARA:'Ibara_Saegusa',
  RINNE:'Rinne_Amagi',
  HIMERU:'HiMERU',
  KOHAKU:'Kohaku_Oukawa', 
  NIKI:'Niki_Shiina',
  HIIRO:'Hiiro_Amagi',
  AIRA:'Aira_Shiratori',
  MAYOI:'Mayoi_Ayase',
  TATSUMI:'Tatsumi_Kazehaya'
};

let userInput; //ckeditor autosaves input here

function setup() {
  $('#defaultOpen').click();
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
      autosave: {
        save(editor) {
          userInput = editor.getData()
          renders();
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

  $('.editor').attr('spellcheck', 'false');
}

function openTab(btn, tabName) {
  $('.tabcontent').hide();
  $('.tablink').removeClass("active");
  var tabId = "#" + tabName;
  $(tabId).css('display', "block");
  $(btn).addClass("active");
}

function copyToClip(){
    $('#output').select();
    document.execCommand("copy");
    $('#copyBtn').text('Copied');
}

//Updating Renders tab based on dialogue input
function updateRenders() {

  const namesSet = new Set();

  //trying to use closure! wow
  return function() {
    //console.log('running renders');

    const input = userInput.split('<p>'); //get array of dialogue lines
    //get first word in each line and check if there's a colon
    const namesRaw = new Set(); //add "key" of each line if there is one
    input.forEach(function(line){
      let nameRaw = line.split(' ')[0]; //get first word in the line
      //console.log('nameRaw: ' + nameRaw);
      if(nameRaw.includes(':')){ //if there is a colon
        namesRaw.add(nameRaw.slice(0, nameRaw.indexOf(':'))); //get text up until colon
      }
    });
    
    const names = new Set() //get set of valid names
    namesRaw.forEach(function(name){
      let nameClean = name.replace(/<\w+>/g, ''); //remove opening html tags
      nameClean = nameClean.replace(/<.\w+>/g, ''); //remove ending html tags
      //console.log('nameClean: ' + nameClean);
      if (namesLink[nameClean.toUpperCase()] != undefined){ //if valid name
        nameClean = nameClean[0].toUpperCase() + nameClean.slice(1, nameClean.length); //format name ex. arashi --> Arashi
        names.add(nameClean);
      }
    });

    //if the character no longer exists in the new chapter,
    //delete character from the Renders options
    namesSet.forEach(function (name) {
      if (!names.has(name)) {
        namesSet.delete(name);
        let cls = "." + name; // row has the name as a class
        $(cls).remove();
        $(`option:contains(${name})`).remove();
      }
    });

    //add character to Renders menu if they don't exist
    names.forEach(function (name) {
      if (!namesSet.has(name)) { //keep the previously existing rows so that renders don't have to be re-entered
        namesSet.add(name);
        //make row with input box for the chara's render
        var newRow = $("<div></div>").addClass(`row ${name}`);
        var newLabel = $("<label class = 'spacer'></label>").append(makeLink(name)).attr("for", name);
        var newInput = $("<input>").attr("id", name)
        $(newRow).append(newLabel);
        $(newRow).append(newInput);
        $('#renderForms').append(newRow);
      }
    });
  }
}

const renders = updateRenders(); //closure!!

function makeLink(name) {
  const link = namesLink[name.toUpperCase()];
  const url = `http://ensemble-stars.wikia.com/wiki/${link}/Gallery#Render`;
  const a = $("<a></a>").text(name).attr("href", url).attr("target", "_blank")
  return a;
}

function convertText() {

  $('#copyBtn').text('Copy Output');

  values = getValues(); //get user input from all the tabs

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

  let input = editor1.getData();
  input = input.split('</p>'); //get array of dialogue lines
  for(let i=0; i<input.length; i++){
    input[i] = input[i].replace(/&nbsp;/g, '');
    input[i] = input[i].replace('<p>', '').trim();
  }
  let output = header;
  console.log(input);

  let currentName = ''; //needed for case where dialogue has name on every line
  let tlToInput = '';
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
        line = formatLine(line);
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
          else if (namesLink[firstWord.toUpperCase()] != undefined){ //if valid character is speaking
            console.log('character speaking... ' + firstWord);
            if (firstWord !== currentName){ //if new character is speaking
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
function isFileName(line){
  const extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  for(let i=0; i<extensions.length; i++){
    if(line.toLowerCase().endsWith(extensions[i])){
      return true;
    }
  }
  return false;
}

//helper function to format bold, italics, links, and TL markers
function formatLine(line){
  line = line.replace(/<\/*strong>/g, "'''") //bold in wiki is like '''this'''
  line = line.replace(/<\/*i>/g, "''") //italic in wiki is like ''this''
  line = formatLink(line);
  line = formatTlMarker(line);
  return line;
}

//helper function to format external links
function formatLink(line){ //link is like this <a href="url">text</a> --> [url text]
  line = line.replace(/<a href="/g, '[');
  line = line.replace(/">/g, ' ');
  line = line.replace(/<\/a>/g, ']');
  return line;
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
function getChapTitle(data){
  if(data.includes('<ol>') && data.includes('<p>')){ //editor already has the <p> in it, so user must input some sort of new <p> (the chapter title) and an <ol> (the TL notes)
    let title = data.split('</p>')[0];
    title = title.replace('<p>', '');
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
function formatTlNotes(data){
  let title = getChapTitle(data); //ERROR: only do this if there are tl notes available
  if (title != undefined) {
    let output =
`|-
| colspan="2"|`;
    let tlCode = `<span id='${title}NoteNUM'>NUM.[[#${title}RefNUM|↑]] TEXT</span><br />`;
    let notes = data.substring(data.indexOf('<li>'), data.lastIndexOf('</li>'))
    notes = notes.split('</li>');
    for(let i=0; i<notes.length; i++){
      notes[i] = notes[i].replace('<li>', '');
      notes[i] = formatLine(notes[i]);
      let newTlCode = tlCode.replace(/NUM/g, i+1);
      output += newTlCode.replace('TEXT', notes[i]);
    }
    output = output.replace(/<br \/>$/m, "\n");
    return output;
  }
  else return ''
}