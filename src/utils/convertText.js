import {
  COLORS_KEYS,
  DETAILS_KEYS,
  GAME_OPTIONS,
  NAME_LINKS,
} from '../constants/';
import extractBr from './extractBr';
import convertEditorDataToDom from './convertEditorDataToDom';
import formatLine, { isFileName } from './formatLine';
import formatStyling from './formatStyling';

/**
 * @typedef DetailsObject
 * An object composed of the values in the Details tab.
 * @type {object}
 * @property {string} location
 * @property {'日日日 (Akira)'|
    '結城由乃 (Yuuki Yoshino)'|
    '西岡麻衣子 (Nishioka Maiko)'|
    'ゆーます (Yuumasu)'|
    '木野誠太郎 (Kino Seitaro)'|
    'Happy Elements株式会社 (Happy Elements K.K)'} author
 * @property {string} translator
 * @property {string} tlLink
 * @property {string} editor
 * @property {string} edLink
 * @property {('Story !!'|'Story')} whatGame
 */

/**
 * @typedef ColorsObject
 * Specific key-value pairs of the color assignments in the Details tab.
 * @type {object}
 * @property {string} writer
 * @property {string} location
 * @property {string} bottom
 * @property {string} text
 */

/**
 * Formats text into source code for the wiki.
 * @param {string} inputData The data from the input CKEditor
 * @param {string} tlNotesData The data from the TL notes CKEditor
 * @param {object} renders Object containing names of the characters found in the TL
 * and their respective render files
 * @param {DetailsObject} details
 * @param {ColorsObject} colors
 * @return {string} The formatted text as a string to be placed in the output textarea
 */

export default function convertText({
  inputData,
  tlNotesData,
  renders,
  details,
  colors,
}) {
  normalizeDetails(details);

  const TEMPLATES = getTemplates(details, colors);
  const inputDom = extractBr(convertEditorDataToDom(inputData));

  const input = inputDom.querySelectorAll('p');
  let output = TEMPLATES.header;

  let tlMarkerCount = 0; // keep track of count to alert user when count mismatches
  let i = 0;

  // user is allowed to specify the header image as the first line in the input
  const firstLine = input[0].textContent.trim();
  if (isFileName(firstLine)) {
    output = output.replace('HEADERFILE', firstLine);
    i += 1;
  }

  const formatLineHelper = formatLine(TEMPLATES, renders);

  for (i; i < input.length; i++) {
    tlMarkerCount += countTlMarkers(input[i].textContent);
    output += formatLineHelper(input[i]);
  }

  if (tlMarkerCount > 0) output += formatTlNotes(tlNotesData, tlMarkerCount);
  output += TEMPLATES.translator;
  output += TEMPLATES.editor || '';
  output += '|}\n';
  output += formatCategories(
    details[DETAILS_KEYS.AUTHOR],
    Object.keys(renders),
    details[DETAILS_KEYS.WHAT_GAME]
  );
  return output;
}

/**
 * Helper function to normalize inputs from the Details tab.
 * Mutates the values directly.
 * @param {DetailsObject} details
 */

function normalizeDetails(details) {
  Object.entries(details).forEach((entry) => {
    const [key, value] = entry;
    details[key] = value.trim();
    // add # character to color if it does not exist
    if (key.endsWith('Col')) {
      details[key] = value.startsWith('#') ? value : `#${value}`;
    }
  });
}

const userUrl = (username) =>
  `https://ensemble-stars.fandom.com/wiki/User:${username}`;
const templateLink = (link, text, color) => `{{Link|${link}|${text}|${color}}}`;
/**
 * Helper function to format the wiki code for story header and footer
 * with the user input
 * Also saves certain values in localStorage for user convenience
 * @param {{string: String, string: String}} details Object containing values from the Details tab
 * @param {} colors Object containing the colors from
 * @return {Object} Object containing the wikia syntax to use as templates
 */
const getTemplates = (details, colors) => {
  const { location, author, translator, tlLink, editor, edLink } = details;
  const {
    [COLORS_KEYS.WRITER]: writerCol,
    [COLORS_KEYS.LOCATION]: locationCol,
    [COLORS_KEYS.BOTTOM]: bottomCol,
    [COLORS_KEYS.TEXT]: textCol,
  } = colors;
  const tlWikiLink = tlLink
    ? templateLink(tlLink, translator, textCol)
    : templateLink(userUrl(translator), translator, textCol);
  let edWikiLink;
  if (editor.length > 0) {
    edWikiLink = edLink
      ? templateLink(edLink, editor, textCol)
      : templateLink(userUrl(editor), editor, textCol);
  }

  updateLocalStorage(DETAILS_KEYS.TRANSLATOR, translator);
  updateLocalStorage(DETAILS_KEYS.TL_LINK, tlLink);
  updateLocalStorage(DETAILS_KEYS.EDITOR, editor);
  updateLocalStorage(DETAILS_KEYS.ED_LINK, edLink);

  const templates = {};

  templates.header = `{| class="article-table" cellspacing="1/6" cellpadding="2" border="1" align="center" width="100%"
! colspan="2" style="text-align:center;background-color:${writerCol}; color:${textCol};" |'''Writer:''' ${author}
|-
| colspan="2" |[[File:HEADERFILE|660px|link=|center]]
|-
! colspan="2" style="text-align:center;background-color:${locationCol}; color:${textCol};" |'''Location: ${location}'''
`;
  templates.dialogueRender = `|-
|[[File:FILENAME|x200px|link=|center]]
|
`;
  templates.cgRender = `|-
! colspan="2" style="text-align:center;" |[[File:FILENAME|center|link=|660px]]
`;
  templates.heading = `|-
! colspan="2" style="text-align:center;background-color:${locationCol}; color:${textCol};" |'''HEADING'''
`;
  templates.translator = `|-
! colspan="2" style="text-align:center;background-color:${bottomCol};color:${textCol};" |'''Translation: ${tlWikiLink} '''
`;
  if (editor.length > 0) {
    templates.editor = `|-
! colspan="2" style="text-align:center;background-color:${bottomCol};color:${textCol};" |'''Proofreading: ${edWikiLink} '''
`;
  }

  return templates;
};

/**
 * Save value in localStorage at specified key
 * @param {string} key
 * @param {string} value
 */

function updateLocalStorage(key, value) {
  if (value.length > 0 && value !== localStorage.getItem(key)) {
    localStorage.setItem(key, value);
  } else if (value.length === 0) {
    localStorage.removeItem(key);
  }
}

/**
 * Get the number of TL markers in the dialogue line
 * @param {string} line
 */

function countTlMarkers(line) {
  return line.match(/\[\d+\]/g) ? line.match(/\[\d+\]/g).length : 0;
}

/*
TL Notes tab is supposed to contain an <ol> but when TLers paste in content it usually just becomes <p>
Users don't always read instructions so need to account for user input wow i love UX design
Editor already contains 1 <p> with the default text "If this is your first time using the formatter..."
If there are TL Notes, assume there would be
 1. A second <p> starting with a number
 2. One <p> and one <ol> if notes are in numbered list
Chapter title is correctly input if:
 - first ChildNode of the editor DOM if child is <p>
 - textContent doesn't match default text or start with a number
Detect if user forgot chapter title and alert user
Get TL Notes which are the rest of the <p> elements or <li> elements
If <p> elements start with number, then new TL note
If not, then multi-paragraph TL note and add <p> content to current TL note
Only gets called if there are TL markers in the dialogue
*/
function formatTlNotes(tlNotesData, count) {
  const title = document.querySelector('#title').value;
  if (title.length > 0) {
    const dom = extractBr(convertEditorDataToDom(tlNotesData));
    let notes = [];
    if (dom.body.firstChild) {
      // if there is text in the TtlEditor
      // ERROR: this doesn't account for possible bolded numbers
      formatStyling(dom);
      // -----IF TL NOTES ARE IN <li>-----
      if (dom.body.firstChild.tagName.toUpperCase() === 'OL') {
        let listItems = Array.from(dom.querySelectorAll('li'));
        listItems = listItems.map((item) =>
          item.textContent.replace(/&nbsp;/g, ' ').trim()
        );
        notes = listItems.filter((item) => item.trim().length > 0); // filter out empty lines
      }
      // -----IF TL NOTES ARE IN <p>-----
      else {
        let paras = Array.from(dom.querySelectorAll('p'));
        notes = paras.reduce((acc, item) => {
          let text = item.textContent.replace(/&nbsp;/g, ' ').trim();
          if (!isNaN(text[0])) {
            // ERROR: assumes the number is separated by space as in "1. note" vs. "1.note"
            acc.push(text.split(' ').slice(1).join(' '));
          } else if (text.length > 0) {
            acc[acc.length - 1] += `\n${text}`;
          }
          return acc;
        }, []);
      }
      if (notes.length !== count) {
        document.querySelector('.error').innerHTML +=
          'WARNING: The formatter detected an unequal number of TL markers and TL notes.';
      }
      let output = `|-
| colspan="2"|`;
      let tlCode = `<span id='${title}NoteNUM'>NUM.[[#${title}RefNUM|↑]] TEXT</span><br />`;
      for (let i = 0; i < notes.length; i++) {
        let newTlCode = tlCode.replace(/NUM/g, i + 1);
        output += newTlCode.replace('TEXT', notes[i]);
      }
      output = output.replace(/<br \/>$/m, '\n');
      return output;
    }
  }
  return '';
}

/**
 * Helper function to add the category tags at the end of the dialogue
 * @param {string} author The author of the story
 * @param {Array<string>} names An Array of character names that appear in the story
 * @param {string} whatGame The game the story belongs to (either ES! or ES!!)
 */

export function formatCategories(author, names, whatGame) {
  let categories = `[[Category:${author}]]`;
  // [[Category:<full name> - Story]] (for ! stories)
  // [[Category:<full name> - Story !!]] (for !! stories)`;
  names.forEach((name) => {
    const fullName = NAME_LINKS[name.toUpperCase()].replace('_', ' ');
    const game = whatGame === GAME_OPTIONS.GAME2 ? 'Story !!' : 'Story';
    categories += `\n[[Category:${fullName} - ${game}]]`;
  });
  return categories;
}
