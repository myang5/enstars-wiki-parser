import { NAME_LINKS } from '../constants';
import formatStyling from './formatStyling';

/*
How formatter converts text (a rough summary)
Types of lines:
 Filename (for images) - formatter checks if file extension like .png exists in line
 (since this probably wouldn't show up in a dialogue line)
 Dialogue line (no label) - formatter checks if first word has no colon.
 Formatter assumes label-less lines that aren't filenames are dialogue lines
 Heading: label
 Name: label
Formatter identifies labels by checking if first word has a colon character (str.split(' '))
Formatter assumes the label is only one word long
Formatter assumes all the other words are part of the line/heading

need to account for text styling and how it might interfere with parsing
code has to handle partial line styling and whole line styling
TLers may paste code from their dreamwidth accounts where they bold/italicize names/headings
case 1: no styling, <p> only contains text
case 3: styling on non-label lines
case 3a: styling on filenames ex. <p><strong>filename</strong></p>
case 3b: styling in dialogue lines (probably intentional) ex. <p><strong>dialogue line</strong></p>
case 3c: partial styling on dialogue lines ex. <p>dialogue <strong>line</strong></p>
case 4: styling on label lines
case 4a: styling on labels ex. <p><strong>Ritsu:</strong> dialogue line</p>
case 4b: styling on informational headings <p><strong>Location: Hallway</strong</p>
case 4c: other partial styling variations

What styling should be kept?
Only styling on the dialogue lines (excluding labels)
How to detect dialogue line styling vs. other styling?
Evaluate <p>.textContent and then decide from there
*/

/**
 * Helper function for convertText that formats each dialogue line.
 * @param {object} TEMPLATES
 * @param {object} renders
 */

export default function formatLine(TEMPLATES, renders) {
  let currentName = ''; // needed for case where dialogue has name on every line
  return (p) => {
    const line = p.textContent.replace(/&nbsp;/g, ' ').trim(); // ignore text styling while evaluating lines
    if (line === '') return line; // ignore empty lines
    // -----FILTER OUT FILE NAMES-----
    if (isFileName(line)) {
      currentName = ''; // since its new section
      return TEMPLATES.cgRender.replace('FILENAME', line.trim());
    }
    // -----PROCESS HEADINGS OR DIALOGUE LINES-----
    p.innerHTML = formatTlMarker(p.innerHTML);
    const firstWord = line.split(' ')[0];
    // -----FILTER OUT DIALOGUE LINES WITH NO LABEL-----
    if (!firstWord.includes(':')) {
      return `${formatStyling(p).innerHTML}\n\n`;
    }
    // -----PROCESS LINES WHERE FIRST WORD HAS A ':'-----
    const label = firstWord.replace(':', '');
    // -----FILTER OUT HEADING LINES-----
    if (label.toUpperCase() === 'HEADING') {
      currentName = ''; // since its new section
      return TEMPLATES.heading.replace(
        'HEADING',
        line.slice(line.indexOf(':') + 1).trim()
      );
    }
    // -----FINALLY PROCESS DIALOGUE LINES WITH LABELS-----
    if (NAME_LINKS[label.toUpperCase()] !== undefined) {
      // if valid character is speaking
      let dialogue = '';
      if (label !== currentName) {
        // if new character is speaking
        currentName = label;
        const renderCode = TEMPLATES.dialogueRender;
        // create id to access chara's render file in Renders tab
        const charName = `${
          label[0].toUpperCase() + label.slice(1, label.length)
        }`;
        dialogue += renderCode.replace('FILENAME', renders[charName].trim());
      }
      // evaluate text inside first node of <p> tag
      // might be an element (has styling) or a text node (no styling)
      // so use textContent instead of innerHTML or innerText
      let contents = p.childNodes[0].textContent;
      // remove firstWord (has colon) in case of <strong>Arashi:</strong> line
      // and also label incase of <strong>Arashi</strong>: line
      // ERROR: this means colon doesn't get removed if it's not styled....
      // TODO: find a better way to deal with styling on label
      contents = contents.replace(firstWord, '');
      contents = contents.replace(label, '');
      if (contents.trim().length === 0) {
        p.childNodes[0].remove();
      } else {
        // if first ChildNode was just the label then remove node
        // set ChildNode HTML
        p.childNodes[0].textContent = contents;
      }
      const newLine = formatStyling(p);
      dialogue += `${newLine.innerHTML.trim()}\n\n`;
      return dialogue;
    }
    return '';
  };
}

/**
 * Check if a dialogue line is actually an image file name
 * @param {string} line
 * @return {boolean}
 */

export function isFileName(line) {
  const extensions = ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.pdf', '.svg'];
  for (let i = 0; i < extensions.length; i++) {
    if (line.toLowerCase().endsWith(extensions[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Formats TL note markers into clickable wiki code citation references
 * [1] --> <span id='${title}RefNUM'>[[#${title}NoteNUM|<sup>[NUM]</sup>]]</span>
 * The complicated id format is required for the citations to work with the
 * story page's tabview, since each tab may have multiple citations with the same number
 * @param {string} line
 * @return {string} The line with any TL markers formatted
 */

function formatTlMarker(line) {
  if (line.search(/\[\d+\]/) > 0) {
    // Look for TL Markers
    const title = document.querySelector('#title').value;
    if (title.length > 0) {
      const markers = line.match(/\[\d+\]/g);
      markers.forEach((marker) => {
        const num = marker.substring(
          marker.indexOf('[') + 1,
          marker.indexOf(']')
        );
        const tlCode = `<span id='${title}Ref${num}'>[[#${title}Note${num}|<sup>[${num}]</sup>]]</span>`;
        line = line.replace(marker, tlCode);
      });
    } else {
      document.querySelector('.error').innerHTML =
        'WARNING: The formatter detected TL notes in the dialogue but no chapter title in the TL Notes tab. TL notes were not formatted.';
    }
  }
  return line;
}
