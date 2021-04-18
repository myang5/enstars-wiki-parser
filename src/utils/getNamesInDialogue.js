import extractBr from './extractBr';
import convertEditorDataToDom from './convertEditorDataToDom';
import { NAME_LINKS } from '../constants';

/**
 * Get the names of the characters in the current dialogue in InputArea component.
 * Used as a callback to the Autosave plugin of the InputEditor.
 * @param {String} editorData The CKEditor data as a string (returned from CKEditor.getData())
 * @return {Object} An Object with the names of the characters initialized
 * with an empty string value
 */

export default function getNamesInDialogue(editorData) {
  const inputDom = extractBr(convertEditorDataToDom(editorData));
  const lines = Array.from(
    inputDom.querySelectorAll('p'),
    (p) => p.textContent
  );
  const names = {}; // add "key" of each line if there is one
  lines.forEach((line) => {
    let name = line.split(' ')[0]; // get first word in the line
    if (name.includes(':')) {
      // if there is a colon
      name = name.slice(0, name.indexOf(':')); // get text up until colon
      if (NAME_LINKS[name.toUpperCase()]) {
        // if valid name
        name = name[0].toUpperCase() + name.slice(1, name.length); // format name: arashi --> Arashi
        names[name] = '';
      }
    }
  });
  return names;
}
