
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
//editorDom: editor data already converted to DOM object
//returns an Array of each line of text
function getTextFromDom(editorDom) {
  var paragraphs = editorDom.querySelectorAll('p'); //NodeList of all p elements
  var input = [];
  paragraphs.forEach(function (p) {
    input.push(p.textContent.replace(/&nbsp;/g, ''));
  });
  return input;
}

//every line in CKEditor will always be in a <p> element
//<br> tags will always be in a <p> element
//goal is to identify new lines, move them into <p> elements, and add them to the document body in the correct order
//pasting from dreamwidth seems to add 2 <br> tags per double line
//possible case includes nested <p> tags but I haven't seen that yet, assume all <br> tags have <p> parents which are childNodes of body
//https://javascript.info/selection-range
function extractBr(inputDom) {
  var hasBr = inputDom.querySelectorAll('br');
  if (hasBr.length > 0) {
    //console.log('has br tags');
    for (var i = 0; i < hasBr.length; i++) {
      var parent = hasBr[i].parentNode;
      var insertInto = parent.parentNode;
      var range = new Range();
      range.setStart(hasBr[i].parentNode, 0);
      range.setEndAfter(hasBr[i]);
      var newP = document.createElement(parent.tagName.toLowerCase());
      newP.append(range.extractContents());
      insertInto.insertBefore(newP, parent);
      hasBr[i].remove();
    }
    //console.log(inputDom);
  }
  return inputDom;
}

//How formatter converts text (a rough summary)
//Types of lines:
//  Filename (for images) - formatter checks if file extension like .png exists in line (since this probably wouldn't show up in a dialogue line)
//  Dialogue line (no label) - formatter checks if first word has no colon. Formatter assumes label-less lines that aren't filenames are dialogue lines
//  Heading: label
//  Name: label
//Formatter identifies labels by checking if first word has a colon character (str.split(' '))
//Formatter assumes the label is only one word long
//Formatter assumes all the other words are part of the line/heading

//need to account for text styling and how it might interfere with parsing
//code has to handle partial line styling and whole line styling
//TLers may paste code from their dreamwidth accounts where they bold/italicize names/headings
//case 1: no styling, <p> only contains text
//case 3: styling on non-label lines
//case 3a: styling on filenames ex. <p><strong>filename</strong></p>
//case 3b: styling in dialogue lines (probably intentional) ex. <p><strong>dialogue line</strong></p>
//case 3c: partial styling on dialogue lines ex. <p>dialogue <strong>line</strong></p>
//case 4: styling on label lines
//case 4a: styling on labels ex. <p><strong>Ritsu:</strong> dialogue line</p>
//case 4b: styling on informational headings <p><strong>Location: Hallway</strong</p>
//case 4c: other partial styling variations

//What styling should be kept?
//Only styling on the dialogue lines (excluding labels)
//How to detect dialogue line styling vs. other styling?
//Evaluate <p>.innerText and then decide from there

function convertText() {

  document.querySelector('#copyBtn').innerHTML = 'Copy Output';

  var values = getValues(); //get user input from all the tabs

  //wiki code templates
  var header = '{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"\n! colspan="2" style="text-align:center;background-color:' + values.writerCol + '; color:' + values.textCol + ';" |\'\'\'Writer:\'\'\' ' + values.author + '\n|-\n| colspan="2" |[[File:HEADERFILE|660px|link=|center]]\n|-\n! colspan="2" style="text-align:center;background-color:' + values.locationCol + '; color:' + values.textCol + ';" |\'\'\'Location: ' + values.location + '\'\'\'\n';
  var dialogueRender = '|-\n|[[File:FILENAME|x200px|link=|center]]\n|\n';
  var cgRender = '|-\n! colspan="2" style="text-align:center;" |[[File:FILENAME|center|660px]]\n';
  var heading = '|-\n! colspan="2" style="text-align:center;background-color:' + values.locationCol + '; color:' + values.textCol + ';" |\'\'\'HEADING\'\'\'\n';
  var translator = '|-\n! colspan="2" style="text-align:center;background-color:' + values.bottomCol + ';color:' + values.textCol + ';" |\'\'\'Translation: [' + values.translator + '] \'\'\'\n';
  var editor = '|-\n! colspan="2" style="text-align:center;background-color:' + values.bottomCol + ';color:' + values.textCol + ';" |\'\'\'Proofreading: [' + values.editor + '] \'\'\'\n';

  function alertOnce() {
    var counter = 0;
    return function () {
      if (counter < 1) {
        var alertMsg = 'The formatter detected a TL marker in the dialogue but no chapter title in the TL Notes section.\nMake sure the first line in the TL Notes section is a chapter title.\nIf this is an error, please contact Midori.';
        alert(alertMsg);
        counter++;
      }
    };
  }

  var alertNoTitleOnce = alertOnce(); //otherwise user will get multiple alerts for same error

  var inputDom = convertToDom(editor1.getData());
  extractBr(inputDom);

  var input = inputDom.querySelectorAll('p');
  var output = header;

  var currentName = ''; //needed for case where dialogue has name on every line
  var tlMarkerCount = 0;
  //console.log('INPUT', input);
  for (var i = 0; i < input.length; i++) {
    var line = input[i].innerText; //ignore possible text styles but keep DOM elements intact to add back dialogue styling
    //console.log('PROCESSING LINE', input[i].innerHTML);
    if (line.replace(/&nbsp;/g, '').trim() != '') {
      //ignore empty lines
      if (isFileName(line)) {
        //console.log('isFileName: true...');
        if (i === 0) {
          //if first line --> header file
          //console.log('headerfile');
          output = output.replace("HEADERFILE", line.trim());
        } else {
          //if CG or scene change image file
          //console.log('image file');
          var cgCode = cgRender;
          output += cgCode.replace("FILENAME", line.trim());
          currentName = ''; //since its new section
        }
      } else {
        //if dialogue line or header
        input[i].innerHTML = formatTlMarker(input[i].innerHTML, alertNoTitleOnce);
        tlMarkerCount += countTlMarkers(line);
        var firstWord = line.split(" ")[0];
        if (!firstWord.includes(":")) {
          //if no colon --> continuing dialogue line
          //console.log('no colon, continue dialogue');
          output += formatStyling(input[i]).innerHTML + "\n\n"; //convert styling to source wiki notation
        } else {
          //if new character is speaking
          //console.log('has colon...');
          var label = firstWord.replace(':', ''); //remove colon
          if (label.toUpperCase() === 'HEADING') {
            //if heading
            //console.log('new HEADING');
            var headingCode = heading;
            output += headingCode.replace("HEADING", line.slice(line.indexOf(':') + 1).trim());
            currentName = ''; //since its new section
          } else if (namesLink[label.toUpperCase()] != undefined) {
            //if valid character is speaking
            //console.log('character speaking... ' + firstWord);
            if (label !== currentName) {
              //if new character is speaking
              //console.log('new character detected')
              var renderCode = dialogueRender;
              var id = "#" + label[0].toUpperCase() + label.slice(1, label.length); //create id to access chara's render file in Renders tab
              output += renderCode.replace("FILENAME", document.querySelector(id).value.trim());
              //update currentName
              currentName = label;
            }
            //input[i].childNodes[0] might be an element or a text node so use textContent instead of innerHTML or innerText
            var contents = input[i].childNodes[0].textContent;
            //console.log('CONTENTS OF FIRST CHILDNODE:', contents);
            contents = contents.replace(firstWord, '').trim(); //get HTMLString of <p> first ChildNode and remove label
            if (contents.length === 0) {
              input[i].childNodes[0].remove();
            } //if first ChildNode was just the label then remove node
            else {
                input[i].childNodes[0].textContent = contents;
              } //set ChildNode HTML
            var newLine = formatStyling(input[i]);
            //console.log('AFTER STYLING', newLine)
            output += newLine.innerHTML.trim() + "\n\n";
          }
        }
      }
    }
  }

  if (tlMarkerCount > 0) output += formatTlNotes(editor2.getData(), tlMarkerCount, alertNoTitleOnce);
  output += translator;
  if (values.editor) output += editor;
  output += '|}';
  document.querySelector('#output').value = output;
  //Error message seems to be more annoying than helpful
  //if (invalidLabel.length > 0) {
  //  //Formatter was unable to process these names:
  //  // 1. truncate after certain length
  //  let alertMsg = 'Formatter was unable to process these names:';
  //  for (let i = 0; i < invalidLabel.length; i++) {
  //    alertMsg += `\n${i + 1}. ${invalidLabel[i].slice(0, 200)}`
  //    if (invalidLabel[i].length > 200) { alertMsg += '...' }
  //    alertMsg += '\n\nDialogue lines should be labeled with character names or "Heading" for scene changes/headings.'
  //    alertMsg += '\nIf this is a problem other than a typo, please contact Midori.'
  //  }
  //  alert(alertMsg);
  //}
}

//helper function for convertText
//also saves certain values in localStorage for convenience
function getValues() {
  var values = {};
  values.location = document.querySelector('#location').value.trim();
  var select = document.querySelector('#author');
  values.author = select.options[select.selectedIndex].text;
  var translator = document.querySelector('#translator').value.trim();
  var tlLink = document.querySelector('#tlLink').value.trim();
  values.translator = tlLink === '' ? '[User:' + translator + '|' + translator + ']' : tlLink + ' ' + translator;
  var editor = document.querySelector('#editor').value.trim();
  if (editor.length > 0) {
    var _edLink = document.querySelector('#edLink').value.trim();
    values.editor = _edLink === '' ? '[User:' + editor + '|' + editor + ']' : _edLink + ' ' + editor;
  }
  values.writerCol = '#' + document.querySelector('input[name=writerCol]').value;
  values.locationCol = '#' + document.querySelector("input[name=locationCol]").value;
  values.bottomCol = '#' + document.querySelector('input[name=bottomCol]').value;
  values.textCol = '#' + document.querySelector('input[name=textCol]').value;

  if (translator.length > 0 && translator !== localStorage.getItem('translator')) {
    localStorage.setItem('translator', translator);
  }
  if (tlLink.length > 0 && tlLink !== localStorage.getItem('tlLink')) {
    localStorage.setItem('tlLink', tlLink);
  }
  if (editor.length > 0 && editor !== localStorage.getItem('editor')) {
    localStorage.setItem('editor', editor);
  }
  if (edLink.length > 0 && edLink !== localStorage.getItem('edLink')) {
    localStorage.setItem('edLink', edLink);
  }

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

function countTlMarkers(line) {
  return line.match(/\[\d+\]/g) ? line.match(/\[\d+\]/g).length : 0;
}

//helper function to format tl note markers
function formatTlMarker(line, error) {
  if (line.search(/\[\d+\]/) > 0) {
    //if there is a tlMarker
    var title = getChapTitle(convertToDom(editor2.getData()), error);
    if (title) {
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

//TL Notes tab is supposed to contain an <ol> but when TLers paste in content it usually just becomes <p>
//Users don't always read instructions so need to account for user input wow i love UX design
//Editor already contains 1 <p> with the default text "If this is your first time using the formatter..."
//If there are TL Notes, there would be
//  1. A second <p> starting with a number
//  2. One <p> and one <ol> if notes are in numbered list
//Chapter title is first ChildNode of the editor DOM if child is <p> and innerText doesn't match default text or start with a number
//Detect if user forgot chapter title and alert user
//Get TL Notes which are the rest of the <p> elements or <li> elements
//If <p> elements start with number, then new TL note
//If not, then multi-paragraph TL note and add <p> content to current TL note
//Only gets called if there are TL markers in the dialogue
function formatTlNotes(data, count, error) {
  var inputDom = convertToDom(data);
  var title = getChapTitle(inputDom, error); //ERROR: only do this if there are tl notes available
  if (title) {
    inputDom.body.firstChild.remove(); //take out title
    extractBr(inputDom);
    var notes = [];
    if (inputDom.body.firstChild) {
      //if there is still more text
      //ERROR: this doesn't account for possible bolded numbers
      formatStyling(inputDom);
      //console.log('TL NOTES', inputDom)
      if (inputDom.body.firstChild.tagName.toUpperCase() === 'OL') {
        //if TL notes are in <li> 
        var listItems = Array.from(inputDom.querySelectorAll('li'));
        //console.log('TL NOTES li', listItems);
        listItems = listItems.map(function (item) {
          return item.textContent.replace(/&nbsp;/g, '').trim();
        });
        listItemsFiltered = listItems.filter(function (item) {
          return item.trim().length > 0;
        }); //filter out empty lines
        notes = listItemsFiltered;
      } else {
        //if TL notes are in <p>  
        var paras = Array.from(inputDom.querySelectorAll('p'));
        paras = paras.map(function (item) {
          //ERROR: doesn't account for multi-paragraph notes
          if (!isNaN(item.textContent[0])) {
            //ERROR: assumes the number is separated by space as in "1. note" vs. "1.note"
            return item.textContent.split(' ').slice(1).join(' ').replace(/&nbsp;/g, '').trim();
          }
          return item.textContent;
        });
        //console.log('TL NOTES p', paras);
        parasFiltered = paras.filter(function (para) {
          return para.trim().length ? true : false;
        }); //filter out empty lines
        notes = parasFiltered;
      }
      if (notes.length !== count) {
        alert('The formatter detected an unequal number of TL markers and TL notes.');
      }
      var output = '|-\n| colspan="2"|';
      var tlCode = '<span id=\'' + title + 'NoteNUM\'>NUM.[[#' + title + 'RefNUM|\u2191]] TEXT</span><br />';
      for (var i = 0; i < notes.length; i++) {
        var newTlCode = tlCode.replace(/NUM/g, i + 1);
        output += newTlCode.replace('TEXT', notes[i]);
      }
      output = output.replace(/<br \/>$/m, "\n");
      return output;
    } else {
      alert('The formatter detected a TL marker in the dialogue but no TL Notes/chapter title in the tab.');
    }
  }
  return '';
}

//helper function to get and format chapter title from tl notes
function getChapTitle(inputDom, error) {
  var firstElt = inputDom.body.firstChild;
  if (firstElt) {
    if (firstElt.tagName === 'P' && firstElt.innerText.indexOf('If this is your first time using the formatter') < 0 && firstElt.innerText.length < 100 //ERROR: Assuming somewhat dangerously that titles would not be longer than 100 characters
    && isNaN(firstElt.innerText[0])) {
      var title = firstElt.innerText.replace(/ /g, '');
      return title;
    }
  } else {
    error();
    return null;
  }
}