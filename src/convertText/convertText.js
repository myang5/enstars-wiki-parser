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
  let breaks = inputDom.querySelectorAll('br');
  if (breaks.length > 0) {
    //console.log('has br tags');
    let parent = breaks[0].parentNode; // the <p> element
    let insertInto = parent.parentNode; // the document.body
    for (let i = 0; i < breaks.length; i++) {
      let range = new Range();
      range.setStart(breaks[i].parentNode, 0); // set start to immediately after the opening <p> tag
      range.setEndBefore(breaks[i]); // set end to right before the <br> tag
      if (!range.collapsed) { // if there is text between the parent <p> and the <br>
        let newP = document.createElement(parent.tagName.toLowerCase());
        newP.append(range.extractContents());
        insertInto.insertBefore(newP, parent);
      }
      breaks[i].remove();
    }
    if (parent.innerHTML.length === 0) parent.remove();
  }
  return inputDom;
}


/**
 * Get the names of the characters in the current dialogue in InputArea component.
 * Used as a callback to the Autosave plugin of the InputEditor.
 * @param editor An instance of CKEditor
 * @return {Set} A Set containing the names of the characters present in the dialogue
 */

export function getNamesInDialogue(editor) {
  let inputDom = extractBr(convertToDom(editor.getData()));
  const paragraphs = inputDom.querySelectorAll('p'); //NodeList of all p elements
  let input = Array.from(paragraphs, p => p.textContent.replace(/&nbsp;/g, ' '));
  const names = {}; //add "key" of each line if there is one
  input.forEach(function (line) {
    let name = line.split(' ')[0]; //get first word in the line
    if (name.includes(':')) { //if there is a colon
      name = name.slice(0, name.indexOf(':')); //get text up until colon
      if (data.NAME_LINKS[name.toUpperCase()]) { //if valid name
        name = name[0].toUpperCase() + name.slice(1, name.length); //format name: arashi --> Arashi
        names[name] = '';
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

export function convertText(editor1, editor2, names, details) {

  document.querySelector('#copyBtn').innerHTML = 'Copy Output';
  document.querySelector('.error').innerHTML = '';

  const TEMPLATES = getTemplates(details); //get user input from all the tabs

  let inputDom = convertToDom(editor1.getData());
  extractBr(inputDom);

  let input = inputDom.querySelectorAll('p');
  let output = TEMPLATES.header;

  let currentName = ''; // needed for case where dialogue has name on every line
  let tlMarkerCount = 0; // keep track of count to alert user when count mismatches
  for (let i = 0; i < input.length; i++) {
    let line = input[i].innerText; // ignore text styling while evaluating lines
    if (line.replace(/&nbsp;/g, ' ').trim() != '') { // ignore empty lines
      // -----FILTER OUT FILE NAMES-----
      if (isFileName(line)) {
        if (i === 0) {
          output = output.replace("HEADERFILE", line.trim());
        }
        else {
          output += TEMPLATES.cgRender.replace("FILENAME", line.trim());
          currentName = ''; // since its new section
        }
      }
      // -----PROCESS HEADINGS OR DIALOGUE LINES-----
      else {
        input[i].innerHTML = formatTlMarker(input[i].innerHTML);
        tlMarkerCount += countTlMarkers(line);
        let firstWord = line.split(" ")[0];
        // -----FILTER OUT DIALOGUE LINES WITH NO LABEL-----
        if (!firstWord.includes(":")) {
          output += formatStyling(input[i]).innerHTML + "\n\n";
        }
        // -----PROCESS LINES WHERE FIRST WORD HAS A ':'-----
        else {
          let label = firstWord.replace(':', ''); // remove colon
          // -----FILTER OUT HEADING LINES-----
          if (label.toUpperCase() === 'HEADING') {
            output += TEMPLATES.heading.replace("HEADING", line.slice(line.indexOf(':') + 1).trim());
            currentName = ''; // since its new section
          }
          // -----FINALLY PROCESS DIALOGUE LINES WITH LABELS-----
          else if (data.NAME_LINKS[label.toUpperCase()] != undefined) { // if valid character is speaking
            if (label !== currentName) { // if new character is speaking
              let renderCode = TEMPLATES.dialogueRender;
              let id = "#" + label[0].toUpperCase() + label.slice(1, label.length); //create id to access chara's render file in Renders tab
              output += renderCode.replace("FILENAME", document.querySelector(id).value.trim());
              //update currentName
              currentName = label;
            }
            // evaluate text inside first node of <p> tag
            // might be an element (has styling) or a text node (no styling)
            // so use textContent instead of innerHTML or innerText
            let contents = input[i].childNodes[0].textContent;
            // remove firstWord (has colon) in case of <strong>Arashi:</strong> line
            // and also label incase of <strong>Arashi</strong>: line
            // ERROR: this means colon doesn't get removed if it's not styled....
            // TODO: find a better way to deal with styling on label
            contents = contents.replace(firstWord, ''); 
            contents = contents.replace(label, '');
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

  if (tlMarkerCount > 0) output += formatTlNotes(editor2, tlMarkerCount);
  output += TEMPLATES.translator;
  output += TEMPLATES.editor || '';
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

/**
 * Helper function to format the wiki code for story header and footer
 * with the user input
 * Also saves certain values in localStorage for user convenience
 * @return {Object} containing the values from 
 */

function getTemplates(details) {
  const values = {...details};
  for (let value in values) {
    values[value] = values[value].trim();
  } 
  console.log('getTemplates values', values);
  const { location, author, translator, tlLink, editor, edLink, writerCol, locationCol, bottomCol, textCol } = values;
  const tlWikiLink = tlLink === '' ? `[User:${translator}|${translator}]` : `${tlLink} ${translator}`;
  let edWikiLink;
  if (editor.length > 0) {
    edWikiLink = edLink === '' ? `[User:${editor}|${editor}]` : `${edLink} ${editor}`;
  }

  updateLocalStorage('translator', translator);
  updateLocalStorage('tlLink', tlLink);
  updateLocalStorage('editor', editor);
  updateLocalStorage('edLink', edLink);

  //wiki code templates
  const templates = {};

  templates.header =
    `{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"
! colspan="2" style="text-align:center;background-color:${writerCol}; color:${textCol};" |'''Writer:''' ${author}
|-
| colspan="2" |[[File:HEADERFILE|660px|link=|center]]
|-
! colspan="2" style="text-align:center;background-color:${locationCol}; color:${textCol};" |'''Location: ${location}'''
`;
  templates.dialogueRender =
    `|-
|[[File:FILENAME|x200px|link=|center]]
|
`;
  templates.cgRender =
    `|-
! colspan="2" style="text-align:center;" |[[File:FILENAME|center|link=|660px]]
`;
  templates.heading =
    `|-
! colspan="2" style="text-align:center;background-color:${locationCol}; color:${textCol};" |'''HEADING'''
`;
  templates.translator =
    `|-
! colspan="2" style="text-align:center;background-color:${bottomCol};color:${textCol};" |'''Translation: [${tlWikiLink}] '''
`;
  if (editor.length > 0) {
    templates.editor =
      `|-
! colspan="2" style="text-align:center;background-color:${bottomCol};color:${textCol};" |'''Proofreading: [${edWikiLink}] '''
`;
  }

  return templates;
}

/**
 * Save value in localStorage at specified key
 * @param {String} key 
 * @param {String} value 
 */

function updateLocalStorage(key, value) {
  if (value.length > 0 && value !== localStorage.getItem(key)) {
    localStorage.setItem(key, value);
  }
  else if (value.length === 0) {
    localStorage.removeItem(key);
  }
}

/**
 * Check if a dialogue line is actually a file name
 * @param {String} line 
 * @return {Boolean}
 */

function isFileName(line) {
  const extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  for (let i = 0; i < extensions.length; i++) {
    if (line.toLowerCase().endsWith(extensions[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Replaces <strong>, <i>, and <a> tags with the wiki code equivalent
 * @param editorDom 
 * @return the editorDom with styling tags replaced
 */
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

/**
 * Get the number of TL markers in the dialogue line
 * @param {String} line 
 * @return {Number}
 */

function countTlMarkers(line) {
  return line.match(/\[\d+\]/g) ? line.match(/\[\d+\]/g).length : 0;
}

/**
 * Formats TL note markers into clickable wiki code citation references
 * [1] --> <span id='${title}RefNUM'>[[#${title}NoteNUM|<sup>[NUM]</sup>]]</span>
 * The complicated id format is required for the citations to work with the 
 * story page's tabview, since each tab may have multiple citations with the same number
 * @param {String} line 
 * @return {String} The line with any TL markers formatted
 */

function formatTlMarker(line) {
  if (line.search(/\[\d+\]/) > 0) { // Look for TL Markers
    const title = document.querySelector('#title').value;
    if (title.length > 0) {
      const markers = line.match(/\[\d+\]/g);
      markers.forEach(marker => {
        const num = marker.substring(marker.indexOf('[') + 1, marker.indexOf(']'));
        const tlCode = `<span id='${title}Ref${num}'>[[#${title}Note${num}|<sup>[${num}]</sup>]]</span>`;
        line = line.replace(marker, tlCode);
      });
    }
    else {
      document.querySelector('.error').innerHTML = 'WARNING: The formatter detected TL notes in the dialogue but no chapter title in the TL Notes tab. TL notes were not formatted.'
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
function formatTlNotes(editor, count) {
  let title = document.querySelector('#title').value;
  if (title.length > 0) {
    let dom = extractBr(convertToDom(editor.getData()));
    let notes = [];
    if (dom.body.firstChild) { //if there is text in the TtlEditor
      //ERROR: this doesn't account for possible bolded numbers
      formatStyling(dom);
      // -----IF TL NOTES ARE IN <li>-----
      if (dom.body.firstChild.tagName.toUpperCase() === 'OL') {
        let listItems = Array.from(dom.querySelectorAll('li'));
        listItems = listItems.map((item) => item.textContent.replace(/&nbsp;/g, ' ').trim());
        notes = listItems.filter((item) => item.trim().length > 0); //filter out empty lines
      } 
      // -----IF TL NOTES ARE IN <p>-----
      else {  
        let paras = Array.from(dom.querySelectorAll('p'));
        notes = paras.reduce((acc, item) => {
          let text = item.textContent.replace(/&nbsp;/g, ' ').trim()
          if (!isNaN(text[0])) { //ERROR: assumes the number is separated by space as in "1. note" vs. "1.note"
            acc.push(text.split(' ').slice(1).join(' '))
          }
          else if (text.length > 0) { acc[acc.length - 1] += `\n${text}` }
          return acc;
        }, []);
      }
      if (notes.length !== count) {
        document.querySelector('.error').innerHTML += 'WARNING: The formatter detected an unequal number of TL markers and TL notes.';
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
    }
  }
  return ''
}

/**
 * 
 * @param {String} author The author of the story
 * @param {Array} characters An Array of character names that appear in the story
 */

export function formatCategories(author, characters, whatGame){
  const categories = 
`[[Category:<writer>]]
[[Category:<full name> - Story]] (for ! stories)
[[Category:<full name> - Story !!]] (for !! stories)`;
  return categories;
    
}


