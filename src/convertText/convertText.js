import * as data from './data';

/**
 * Helper function to convert the data returned as a String
 * from CKEditor into a DOM Object
 * @param {String} data The data returned from CKEditor.getData()
 * @return The result of parsing the data into a DOM object
 */
export function convertToDom(data) {
  return new DOMParser().parseFromString(data, 'text/html');
}


/**
   * Pasting from DreamWidth seems to add 2 <br> tags per new line
   * instead of wrapping the line in <p> elements.
   * However, most of the functions work based on the assumption that each
   * line of text is wrapped in a <p> element
   * This helper function identifies new lines, moves them into <p> elements,
   * and adds them to the document body.
   * Possible case includes nested <p> tags but I haven't seen that yet, 
   * so code assumes this input structure:
   * <body>
   *  <p>
   *    Line1
   *    <br><br>
   *    Line2
   *    <br><br>
   *    Line3
   *  </p>
   * </body>
   * And the desired output structure is:
   * <body>
   *  <p>Line1</p>
   *  <p>Line2</p>
   *  <p>Line3</p>
   * </body>
   * Function uses selection ranges: https://javascript.info/selection-range
   * @param inputDom The CKEDitor content converted to a DOM object using convertToDom()
   * @return The edited CKEditor DOM with lines placed in <p> elements.
   */
  export function extractBr(inputDom) {
    // Assumes content with proper <p> formatting wouldn't have <br> tags
    let hasBr = inputDom.querySelectorAll('br');
    if (hasBr.length > 0) {
      //console.log('has br tags');
      for (let i = 0; i < hasBr.length; i++) {
        let parent = hasBr[i].parentNode; // the <p> element
        let insertInto = parent.parentNode; // the document.body
        let range = new Range();
        range.setStart(hasBr[i].parentNode, 0); // set start to immediately after the opening <p> tag
        range.setEndAfter(hasBr[i]); //set end to the <br> tag itself
        let newP = document.createElement(parent.tagName.toLowerCase());
        newP.append(range.extractContents());
        insertInto.insertBefore(newP, parent);
        hasBr[i].remove();
      }
    }
    return inputDom;
  }


/**
 * Extract the text from the CKEditor.
 * Each line is wrapped in a <p> element.
 * @param editorDom The CKEDitor content converted to a DOM object using convertToDom()
 * @return {Array} An array containing the text content of each paragraph
 */
export function getTextFromDom(editorDom) {
  const paragraphs = editorDom.querySelectorAll('p'); //NodeList of all p elements
  const input = []
  paragraphs.forEach(function (p) {
    input.push(p.textContent.replace(/&nbsp;/g, ' '));
  });
  return input;
}


/**
 * Get the names of the characters in the current dialogue in InputArea component.
 * Used as a callback to the Autosave plugin of the InputEditor.
 * @param editor An instance of CKEditor
 * @return {Set} A Set containing the names of the characters present in the dialogue
 */
export function getNamesInDialogue(editor) {
  let inputDom = extractBr(convertToDom(editor.getData()))
  let input = getTextFromDom(inputDom);
  const names = new Set(); //add "key" of each line if there is one
  input.forEach(function (line) {
    let name = line.split(' ')[0]; //get first word in the line
    if (name.includes(':')) { //if there is a colon
      name = name.slice(0, name.indexOf(':')); //get text up until colon
      if (data.NAME_LINKS[name.toUpperCase()] != undefined) { //if valid name
        name = name[0].toUpperCase() + name.slice(1, name.length); //format name: arashi --> Arashi
        names.add(name);
      }
    }
  });
  return names;
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

  const values = getValues(); //get user input from all the tabs

  //wiki code templates
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
`;
  const translator =
    `|-
! colspan="2" style="text-align:center;background-color:${values.bottomCol};color:${values.textCol};" |'''Translation: [${values.translator}] '''
`;
  const editor =
    `|-
! colspan="2" style="text-align:center;background-color:${values.bottomCol};color:${values.textCol};" |'''Proofreading: [${values.editor}] '''
`;

  function alertOnce() {
    let counter = 0;
    return function () {
      if (counter < 1) {
        const alertMsg =
          `The formatter detected a TL marker in the dialogue but no chapter title in the TL Notes section.
Make sure the first line in the TL Notes section is a chapter title.
If this is an error, please contact Midori.`
        alert(alertMsg)
        counter++;
      }
    }
  }

  const alertNoTitleOnce = alertOnce(); //otherwise user will get multiple alerts for same error

  let inputDom = convertToDom(editor1.getData());
  extractBr(inputDom);

  let input = inputDom.querySelectorAll('p');
  let output = header;

  let currentName = ''; //needed for case where dialogue has name on every line
  let tlMarkerCount = 0;
  for (let i = 0; i < input.length; i++) {
    let line = input[i].innerText; //ignore possible text styles but keep DOM elements intact to add back dialogue styling
    if (line.replace(/&nbsp;/g, ' ').trim() != '') { //ignore empty lines
      if (isFileName(line)) {
        if (i === 0) { //if first line --> header file
          output = output.replace("HEADERFILE", line.trim());
        }
        else { //if CG or scene change image file
          let cgCode = cgRender;
          output += cgCode.replace("FILENAME", line.trim());
          currentName = ''; //since its new section
        }
      }
      else { //if dialogue line or header
        input[i].innerHTML = formatTlMarker(input[i].innerHTML, alertNoTitleOnce);
        tlMarkerCount += countTlMarkers(line);
        let firstWord = line.split(" ")[0];
        if (!firstWord.includes(":")) { //if no colon --> continuing dialogue line
          output += formatStyling(input[i]).innerHTML + "\n\n"; //convert styling to source wiki notation
        }
        else { //if new character is speaking or heading
          let label = firstWord.replace(':', ''); //remove colon
          if (label.toUpperCase() === 'HEADING') { //if heading
            let headingCode = heading;
            output += headingCode.replace("HEADING", line.slice(line.indexOf(':') + 1).trim());
            currentName = ''; //since its new section
          }
          else if (data.NAME_LINKS[label.toUpperCase()] != undefined) { //if valid character is speaking
            if (label !== currentName) { //if new character is speaking
              let renderCode = dialogueRender;
              let id = "#" + label[0].toUpperCase() + label.slice(1, label.length); //create id to access chara's render file in Renders tab
              output += renderCode.replace("FILENAME", document.querySelector(id).value.trim());
              //update currentName
              currentName = label;
            }
            //input[i].childNodes[0] might be an element or a text node so use textContent instead of innerHTML or innerText
            let contents = input[i].childNodes[0].textContent;
            contents = contents.replace(firstWord, ''); //get HTMLString of <p> first ChildNode and remove label
            if (contents.trim().length === 0) { input[i].childNodes[0].remove(); } //if first ChildNode was just the label then remove node
            else { //set ChildNode HTML
              input[i].childNodes[0].textContent = contents;
            }
            let newLine = formatStyling(input[i]);
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
  const values = {};
  values.location = document.querySelector('#location').value.trim();
  const select = document.querySelector('#author');
  values.author = select.options[select.selectedIndex].text;
  const translator = document.querySelector('#translator').value.trim();
  const tlLink = document.querySelector('#tlLink').value.trim();
  values.translator = tlLink === '' ? `[User:${translator}|${translator}]` : `${tlLink} ${translator}`;
  const editor = document.querySelector('#editor').value.trim();
  const edLink = document.querySelector('#edLink').value.trim();
  if (editor.length > 0) {
    values.editor = edLink === '' ? `[User:${editor}|${editor}]` : `${edLink} ${editor}`;
  }
  values.writerCol = '#' + document.querySelector('input[name=writerCol]').value;
  values.locationCol = '#' + document.querySelector("input[name=locationCol]").value;
  values.bottomCol = '#' + document.querySelector('input[name=bottomCol]').value;
  values.textCol = '#' + document.querySelector('input[name=textCol]').value;

  updateLocalStorage('translator', translator);
  updateLocalStorage('tlLink', tlLink);
  updateLocalStorage('editor', editor);
  updateLocalStorage('edLink', edLink);

  return values;
}

function updateLocalStorage(key, value) {
  console.log(key, value);
  if (value.length > 0 && value !== localStorage.getItem(key)) {
    localStorage.setItem(key, value);
  }
  else if (value.length === 0) {
    localStorage.removeItem(key);
  }
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

function countTlMarkers(line) {
  return line.match(/\[\d+\]/g) ? line.match(/\[\d+\]/g).length : 0;
}

//helper function to format tl note markers
function formatTlMarker(line, error) {
  if (line.search(/\[\d+\]/) > 0) { //if there is a tlMarker
    let title = getChapTitle(convertToDom(editor2.getData()), error);
    if (title) {
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

//TL Notes tab is supposed to contain an <ol> but when TLers paste in content it usually just becomes <p>
//Users don't always read instructions so need to account for user input wow i love UX design
//Editor already contains 1 <p> with the default text "If this is your first time using the formatter..."
//If there are TL Notes, assume there would be
//  1. A second <p> starting with a number
//  2. One <p> and one <ol> if notes are in numbered list
//Chapter title is correctly input if:
//  - first ChildNode of the editor DOM if child is <p> 
//  - innerText doesn't match default text or start with a number
//Detect if user forgot chapter title and alert user
//Get TL Notes which are the rest of the <p> elements or <li> elements
//If <p> elements start with number, then new TL note
//If not, then multi-paragraph TL note and add <p> content to current TL note
//Only gets called if there are TL markers in the dialogue
function formatTlNotes(data, count, error) {
  let inputDom = convertToDom(data);
  let title = getChapTitle(inputDom, error); //ERROR: only do this if there are tl notes available
  if (title) {
    inputDom.body.firstChild.remove(); //take out title
    extractBr(inputDom);
    let notes = [];
    if (inputDom.body.firstChild) { //if there is still more text
      //ERROR: this doesn't account for possible bolded numbers
      formatStyling(inputDom);
      if (inputDom.body.firstChild.tagName.toUpperCase() === 'OL') { //if TL notes are in <li> 
        let listItems = Array.from(inputDom.querySelectorAll('li'));
        listItems = listItems.map((item) => item.textContent.replace(/&nbsp;/g, ' ').trim());
        listItemsFiltered = listItems.filter((item) => item.trim().length > 0); //filter out empty lines
        notes = listItemsFiltered;
      } else { //if TL notes are in <p>  
        let paras = Array.from(inputDom.querySelectorAll('p'));
        notes = paras.reduce((acc, item) => {
          let text = item.textContent.replace(/&nbsp;/g, ' ').trim()
          if (!isNaN(text[0])) { //ERROR: assumes the number is separated by space as in "1. note" vs. "1.note"
            acc.push(text.split(' ').slice(1).join(' '))
          }
          else if (text.length > 0) { acc[acc.length - 1] += `\n${text}` }
          return acc;
        }, []);
        //parasFiltered = paras.filter((para) => para.trim().length ? true : false); //filter out empty lines
      }
      if (notes.length !== count) {
        alert('The formatter detected an unequal number of TL markers and TL notes.')
      }
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
    } else { alert('The formatter detected a TL marker in the dialogue but no TL Notes/chapter title in the tab.') }
  }
  return ''
}

//helper function to get and format chapter title from tl notes
function getChapTitle(inputDom, error) {
  let firstElt = inputDom.body.firstChild;
  if (firstElt) {
    if (firstElt.tagName === 'P'
      && firstElt.innerText.indexOf('If this is your first time using the formatter') < 0
      && firstElt.innerText.length < 100 //ERROR: Assuming somewhat dangerously that titles would not be longer than 100 characters
      && isNaN(firstElt.innerText[0])) {
      const title = firstElt.innerText.replace(/ /g, '');
      return title;
    }
  }
  else {
    error();
    return null;
  }
}
