var namesLink = {
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

//copies text to clipboard
function copyToClip() {
  document.querySelector('#output').select();
  document.execCommand("copy");
  document.querySelector('#copyBtn').innerHTML = 'Copied';
}

//lmao
function convertToDom(data) {
  return new DOMParser().parseFromString(data, 'text/html');
}

//each line in CKEditor has <p> wrapper
//params: editorDom - editor data already converted to DOM object
//returns an Array of each line of text
function getTextFromDom(editorDom) {
  var paragraphs = editorDom.querySelectorAll('p');
  var input = [];
  paragraphs.forEach(function (p) {
    input.push(p.innerHTML.replace(/&nbsp;/g, ''));
  });
  return input;
}

function convertText() {

  document.querySelector('#copyBtn').innerHTML = 'Copy Output';

  var values = getValues(); //get user input from all the tabs

  //format wiki code with user input
  var header = '{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"\n! colspan="2" style="text-align:center;background-color:' + values.writerCol + '; color:' + values.textCol + ';" |\'\'\'Writer:\'\'\' ' + values.author + '\n|-\n| colspan="2" |[[File:HEADERFILE|660px|link=|center]]\n|-\n! colspan="2" style="text-align:center;background-color:' + values.locationCol + '; color:' + values.textCol + ';" |\'\'\'Location: ' + values.location + '\'\'\'\n';
  var dialogueRender = '|-\n|[[File:FILENAME|x200px|link=|center]]\n|\n';
  var cgRender = '|-\n! colspan="2" style="text-align:center;" |[[File:FILENAME|center|660px]]\n';
  var heading = '|-\n! colspan="2" style="text-align:center;background-color:' + values.locationCol + '; color:' + values.textCol + ';" |\'\'\'HEADING\'\'\'\n';
  var footer = '|-\n! colspan="2" style="text-align:center;background-color:' + values.bottomCol + ';color:' + values.textCol + ';" |\'\'\'Translation: [' + values.translator + '] \'\'\'\n|}';

  var inputDom = formatStyling(convertToDom(editor1.getData()));
  var input = getTextFromDom(inputDom);
  var output = header;

  var currentName = ''; //needed for case where dialogue has name on every line
  input.forEach(function (line) {
    if (line != '') {
      //ignore empty lines
      if (isFileName(line)) {
        console.log('isFileName: true...');
        //alert user if there is no header
        if (input.indexOf(line) === 0) {
          //if image file for the header 
          console.log('headerfile');
          output = output.replace("HEADERFILE", line.trim());
        } else {
          //if CG or scene change image file
          console.log('image file');
          var cgCode = cgRender;
          output += cgCode.replace("FILENAME", line.trim());
          currentName = ''; //since its new section
        }
      } else {
        //if dialogue line or header
        line = formatTlMarker(line);
        var firstWord = line.split(" ")[0];
        if (!firstWord.includes(":")) {
          //if no colon --> continuing dialogue line
          console.log('no colon, continue dialogue');
          output += line + "\n\n";
        } else {
          console.log('has colon...');
          firstWord = firstWord.slice(0, -1); //remove colon
          if (firstWord.toUpperCase() === 'HEADING') {
            //if heading
            console.log('new HEADING');
            var headingCode = heading;
            output += headingCode.replace("HEADING", line.slice(line.indexOf(':') + 1).trim());
            currentName = ''; //since its new section
          } else if (namesLink[firstWord.toUpperCase()] != undefined) {
            //if valid character is speaking
            console.log('character speaking... ' + firstWord);
            if (firstWord !== currentName) {
              //if new character is speaking
              console.log('new character detected');
              //add dialogueRender code to output
              var renderCode = dialogueRender;
              var id = "#" + firstWord[0].toUpperCase() + firstWord.slice(1, firstWord.length); //create id to access chara's render file in Renders tab
              output += renderCode.replace("FILENAME", document.querySelector(id).value.trim());
              //update currentName
              currentName = firstWord;
            }
            line = line.slice(line.indexOf(":") + 1).trim(); //get chara's spoken line
            output += line + "\n\n";
          } else {
            console.log('Formatter was unable to process this name: ' + firstWord);
          }
        }
      }
    }
  });

  output += formatTlNotes(editor2.getData());
  output += footer;
  document.querySelector('#output').value = output;
}

//helper function for convertText
function getValues() {
  var values = {};
  values.location = document.querySelector('#location').value.trim();
  var select = document.querySelector('#author');
  values.author = select.options[select.selectedIndex].text;
  values.translator = document.querySelector('#translator').value.trim();
  values.tlLink = document.querySelector('#tlLink').value.trim();
  if (values.tlLink === '') {
    //if TL credit is to a wiki user
    values.translator = '[User:' + values.translator + '|' + values.translator + ']';
  } else {
    //if TL credit is to an external wiki user
    values.translator = values.tlLink + ' ' + values.translator;
  }
  values.writerCol = '#' + document.querySelector('input[name=writerCol]').value;
  values.locationCol = '#' + document.querySelector("input[name=locationCol]").value;
  values.bottomCol = '#' + document.querySelector('input[name=bottomCol]').value;
  values.textCol = '#' + document.querySelector('input[name=textCol]').value;
  return values;
}

//helper function to check if the line is a file
//params: line - a String
//returns a boolean value representing if the string is a file name
function isFileName(line) {
  var extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  for (var i = 0; i < extensions.length; i++) {
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
    strong.replaceWith('\'\'\'' + strong.innerText + '\'\'\'');
  });
  editorDom.querySelectorAll('i').forEach(function (italic) {
    italic.replaceWith('\'\'' + italic.innerText + '\'\'');
  });
  editorDom.querySelectorAll('a').forEach(function (link) {
    link.replaceWith('[' + link.href + ' ' + link.innerText + ']');
  });
  return editorDom;
}

//helper function to format tl note markers
function formatTlMarker(line) {
  if (line.search(/\[\d+\]/) != -1) {
    //if there is a tlMarker
    var title = getChapTitle(editor2.getData());
    if (title != undefined) {
      var tlCode = '<span id=\'' + title + 'RefNUM\'>[[#' + title + 'NoteNUM|<sup>[NUM]</sup>]]</span>';
      var markers = line.match(/\[\d+\]/g);
      markers.forEach(function (marker) {
        var num = marker.substring(marker.indexOf('[') + 1, marker.indexOf(']'));
        var newTlCode = tlCode.replace(/NUM/g, num);
        line = line.replace(marker, newTlCode);
      });
    }
  }
  return line;
}

//helper function to get and format chapter title from tl notes
//assumes the editor has some data
function getChapTitle(data) {
  if (data.includes('<ol>') && data.includes('<p>')) {
    //editor already has the <p> in it, so user must input some sort of new <p> (the chapter title) and an <ol> (the TL notes)
    //let inputDom = clearGDocSpan(convertToDom(data).querySelector('p'));
    var inputDom = convertToDom(data).querySelector('p');
    var title = inputDom.innerText;
    title = title.replace(' ', '');
    return title;
  } else {
    //ERROR: add alert to let user know they didn't provide a chapter title
    console.log('Please make sure to include a title in the TL Notes section');
  }
}

//helper function to format TlNotes
//assumes that there is a valid title and correct number of TL notes
function formatTlNotes() {
  var title = getChapTitle(editor2.getData()); //ERROR: only do this if there are tl notes available
  if (title != undefined) {
    var inputDom = formatStyling(convertToDom(editor2.getData()));
    var notes = [];
    var listItems = inputDom.querySelectorAll('li');
    listItems.forEach(function (li) {
      notes.push(li.innerHTML.replace(/&nbsp;/g, ''));
    });
    var output = '|-\n| colspan="2"|';
    var tlCode = '<span id=\'' + title + 'NoteNUM\'>NUM.[[#' + title + 'RefNUM|\u2191]] TEXT</span><br />';
    for (var i = 0; i < notes.length; i++) {
      var newTlCode = tlCode.replace(/NUM/g, i + 1);
      output += newTlCode.replace('TEXT', notes[i]);
    }
    output = output.replace(/<br \/>$/m, "\n");
    return output;
  } else return '';
}