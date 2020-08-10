const { convertText } = require('../src/convertText/convertText');

describe('convertText', () => {
  const editor1 = new Document();
  const editor2 = new Document();

  beforeEach(() => {
    editor1.body.innerHTML = '';
    editor2.body.innerHTML = '';
  });

  //test every type of line with different styling added
  //Types of lines:
    //  Filename (for images) - formatter checks if file extension like .png exists in line (since this probably wouldn't show up in a dialogue line)
    //  Dialogue line (no label) - formatter checks if first word has no colon. Formatter assumes label-less lines that aren't filenames are dialogue lines
    //  Heading: label
    //  Name: label

  describe('filename lines', () => {});
  describe('heading lines', () => {});
  describe('dialogue lines', () => {});
 
});